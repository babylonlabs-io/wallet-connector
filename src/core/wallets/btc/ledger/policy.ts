import Transport from "@ledgerhq/hw-transport";
import {
  computeLeafHash,
  slashingPathPolicy,
  SlashingPolicy,
  StakingTxPolicy,
  stakingTxPolicy,
  timelockPathPolicy,
  TimelockPolicy,
  unbondingPathPolicy,
  UnbondingPolicy,
  WalletPolicy,
} from "ledger-bitcoin-babylon";

import { Contract, Network } from "@/core/types";
import { BABYLON_SIGNING_CONTRACTS } from "@/core/utils/contracts";

import { getSigningStep, SignginStep } from "./signingStep";

export const UNBONDING_POLICY: UnbondingPolicy = "Unbonding";
export const SLASHING_POLICY: SlashingPolicy = "Consent to slashing";
export const UNBONDING_SLASHING_POLICY: SlashingPolicy = "Consent to unbonding slashing";
export const STAKING_POLICY: StakingTxPolicy = "Staking transaction";
export const WITHDRAWAL_POLICY: TimelockPolicy = "Withdraw";

export const getPolicyForTransaction = async (
  transport: Transport,
  network: Network,
  derivationPath: string,
  psbtBase64: string,
  constracts: Contract[],
): Promise<WalletPolicy> => {
  const isTestnet = network !== Network.MAINNET;

  // TODO: A temporary solution to determine the signing step from dApp.
  // This will be replaced once dApp is able to passdown the signing step.
  const signingStep = getSigningStep(constracts);

  switch (signingStep) {
    case SignginStep.STAKING:
      return getStakingPolicy(constracts, derivationPath, transport, isTestnet);
    case SignginStep.UNBONDING:
      return getUnbondingPolicy(constracts, derivationPath, transport, isTestnet, psbtBase64);
    case SignginStep.SLASHING:
      return getSlashingPolicy(constracts, derivationPath, transport, isTestnet, psbtBase64);
    case SignginStep.UNBONDING_SLASHING:
      return getUnbondingSlashingPolicy(constracts, derivationPath, transport, isTestnet, psbtBase64);
    case SignginStep.WITHDRAW:
      return getWithdrawPolicy(constracts, derivationPath, psbtBase64, transport, isTestnet);
    default:
      throw new Error(`Unknown signing step: ${signingStep}`);
  }
};

export const getStakingPolicy = (
  signingContracts: Contract[],
  derivationPath: string,
  transport: Transport,
  isTestnet: boolean,
): Promise<WalletPolicy> => {
  const stakingContract = signingContracts.find((contract) => contract.id === BABYLON_SIGNING_CONTRACTS.STAKING);
  if (!stakingContract) {
    throw new Error("Staking contract is required");
  }

  const { finalityProviders, covenantThreshold, covenantPks, stakingDuration } = stakingContract.params;

  return stakingTxPolicy({
    policyName: STAKING_POLICY,
    transport,
    params: {
      finalityProviders: finalityProviders as string[],
      covenantThreshold: covenantThreshold as number,
      covenantPks: covenantPks as string[],
      timelockBlocks: stakingDuration as number,
    },
    derivationPath,
    isTestnet,
  });
};

export const getUnbondingPolicy = (
  contracts: Contract[],
  derivationPath: string,
  transport: Transport,
  isTestnet: boolean,
  psbtBase64: string,
): Promise<WalletPolicy> => {
  const unbondingContract = contracts.find((contract) => contract.id === BABYLON_SIGNING_CONTRACTS.UNBONDING);
  if (!unbondingContract) {
    throw new Error("Unbonding contract is required");
  }

  const leafHash = computeLeafHash(psbtBase64);
  if (!leafHash) {
    throw new Error("Could not compute leaf hash");
  }

  const { finalityProviders, covenantThreshold, covenantPks, unbondingTimeBlocks, unbondingFeeSat } =
    unbondingContract.params;

  return unbondingPathPolicy({
    policyName: UNBONDING_POLICY,
    transport,
    params: {
      finalityProviders: finalityProviders as string[],
      covenantThreshold: covenantThreshold as number,
      covenantPks: covenantPks as string[],
      leafHash,
      timelockBlocks: unbondingTimeBlocks as number,
      unbondingFeeSat: unbondingFeeSat as number,
    },
    derivationPath,
    isTestnet,
  });
};

export const getSlashingPolicy = (
  contracts: Contract[],
  derivationPath: string,
  transport: Transport,
  isTestnet: boolean,
  psbtBase64: string,
): Promise<WalletPolicy> => {
  const slashingContract = contracts.find((contract) => contract.id === BABYLON_SIGNING_CONTRACTS.SLASHING);
  if (!slashingContract) {
    throw new Error("Slashing contract is required in slashing transaction");
  }
  const stakingContract = contracts.find((contract) => contract.id === BABYLON_SIGNING_CONTRACTS.STAKING);
  if (!stakingContract) {
    throw new Error("Staking contract is required in slashing transaction");
  }

  const slashingBurnContract = contracts.find((contract) => contract.id === BABYLON_SIGNING_CONTRACTS.SLASHING_BURN);
  if (!slashingBurnContract) {
    throw new Error("Slashing burn contract is required in unbonding slashing transaction");
  }

  const { unbondingTimeBlocks, slashingFeeSat } = slashingContract.params;
  const { covenantPks, finalityProviders, covenantThreshold } = stakingContract.params;

  const { slashingPkScriptHex } = slashingBurnContract.params;

  const leafHash = computeLeafHash(psbtBase64);
  if (!leafHash) {
    throw new Error("Could not compute leaf hash");
  }

  return slashingPathPolicy({
    policyName: SLASHING_POLICY,
    transport,
    params: {
      leafHash,
      timelockBlocks: unbondingTimeBlocks as number,
      finalityProviders: finalityProviders as string[],
      covenantThreshold: covenantThreshold as number,
      covenantPks: covenantPks as string[],
      slashingPkScriptHex: slashingPkScriptHex as string,
      slashingFeeSat: slashingFeeSat as number,
    },
    derivationPath,
    isTestnet,
  });
};

export const getUnbondingSlashingPolicy = (
  contracts: Contract[],
  derivationPath: string,
  transport: Transport,
  isTestnet: boolean,
  psbtBase64: string,
): Promise<WalletPolicy> => {
  const slashingContract = contracts.find((contract) => contract.id === BABYLON_SIGNING_CONTRACTS.SLASHING);
  if (!slashingContract) {
    throw new Error("Slashing contract is required in unbonding slashing transaction");
  }
  const unbondingContract = contracts.find((contract) => contract.id === BABYLON_SIGNING_CONTRACTS.UNBONDING);
  if (!unbondingContract) {
    throw new Error("Unbonding contract is required in unbonding slashing transaction");
  }

  const slashingBurnContract = contracts.find((contract) => contract.id === BABYLON_SIGNING_CONTRACTS.SLASHING_BURN);
  if (!slashingBurnContract) {
    throw new Error("Slashing burn contract is required in unbonding slashing transaction");
  }

  const { unbondingTimeBlocks, slashingFeeSat } = slashingContract.params;
  const { covenantPks, finalityProviders, covenantThreshold } = unbondingContract.params;

  const { slashingPkScriptHex } = slashingBurnContract.params;

  const leafHash = computeLeafHash(psbtBase64);
  if (!leafHash) {
    throw new Error("Could not compute leaf hash");
  }

  return slashingPathPolicy({
    policyName: UNBONDING_SLASHING_POLICY,
    transport,
    params: {
      leafHash,
      timelockBlocks: unbondingTimeBlocks as number,
      finalityProviders: finalityProviders as string[],
      covenantThreshold: covenantThreshold as number,
      covenantPks: covenantPks as string[],
      slashingPkScriptHex: slashingPkScriptHex as string,
      slashingFeeSat: slashingFeeSat as number,
    },
    derivationPath,
    isTestnet,
  });
};

const getWithdrawPolicy = (
  contracts: Contract[],
  derivationPath: string,
  psbtBase64: string,
  transport: Transport,
  isTestnet: boolean,
): Promise<WalletPolicy> => {
  const withdrawContract = contracts.find((contract) => contract.id === BABYLON_SIGNING_CONTRACTS.WITHDRAW);
  if (!withdrawContract) {
    throw new Error("Withdraw timelock expired contract is required");
  }

  const { timelockBlocks } = withdrawContract.params;

  const leafHash = computeLeafHash(psbtBase64);
  if (!leafHash) {
    throw new Error("Could not compute leaf hash");
  }

  return timelockPathPolicy({
    policyName: WITHDRAWAL_POLICY,
    transport,
    params: {
      leafHash,
      timelockBlocks: timelockBlocks as number,
    },
    derivationPath,
    isTestnet,
  });
};
