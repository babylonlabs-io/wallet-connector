import type { Contract } from "@/core/types";

import { BABYLON_SIGNING_CONTRACTS } from "../../../utils/contracts";

/**
 * Enum for transaction types based on contract combinations
 */
export enum SignginStep {
  STAKING = "staking",
  UNBONDING = "unbonding",
  SLASHING = "slashing",
  UNBONDING_SLASHING = "unbonding-slashing",
  WITHDRAW = "withdraw",
}

// TODO: Temporary solution until we pass down the signing step from dApp
export function getSigningStep(contracts?: Contract[]): SignginStep | undefined {
  if (!contracts || contracts.length === 0) {
    return undefined;
  }

  const contractIds = contracts.map((contract) => contract.id);

  const hasStaking = contractIds.includes(BABYLON_SIGNING_CONTRACTS.STAKING);
  const hasUnbonding = contractIds.includes(BABYLON_SIGNING_CONTRACTS.UNBONDING);
  const hasSlashing = contractIds.includes(BABYLON_SIGNING_CONTRACTS.SLASHING);
  const hasSlashingBurn = contractIds.includes(BABYLON_SIGNING_CONTRACTS.SLASHING_BURN);

  const hasWithdraw = contractIds.includes(BABYLON_SIGNING_CONTRACTS.WITHDRAW);

  if (hasStaking && !hasUnbonding && !hasSlashing && !hasSlashingBurn) {
    return SignginStep.STAKING;
  } else if (hasStaking && hasUnbonding) {
    return SignginStep.UNBONDING;
  } else if (hasStaking && hasSlashing && hasSlashingBurn) {
    return SignginStep.SLASHING;
  } else if (hasUnbonding && hasSlashing && hasSlashingBurn) {
    return SignginStep.UNBONDING_SLASHING;
  } else if (hasWithdraw) {
    return SignginStep.WITHDRAW;
  }
  throw new Error("Unknown signing step");
}
