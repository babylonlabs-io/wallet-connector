import type { SignPsbtOptions } from "@/core/types";

/**
 * Enum for transaction types based on contract combinations
 */
export enum ContractType {
  STAKING = "staking",
  UNBONDING = "unbonding",
  STAKING_SLASHING = "staking-slashing",
  UNBONDING_SLASHING = "unbonding-slashing",
  SLASHING_BURN = "slashing-burn",
}

/**
 * Determines the transaction type based on the contracts in the options.
 *
 * - Staking: only babylon:staking contract
 * - Unbonding: only babylon:unbonding contract
 * - Staking Slashing: babylon:staking + babylon:slashing contracts
 * - Unbonding Slashing: babylon:unbonding + babylon:slashing contracts
 * - Slashing Burn: babylon:slashing-burn contract
 *
 * @param options The PSBT signing options that contain contract information
 * @returns The ContractType enum value representing the transaction type, or undefined if not determinable
 */
export function getContractType(options?: SignPsbtOptions): ContractType | undefined {
  if (!options?.contracts || options.contracts.length === 0) {
    return undefined;
  }

  const contractIds = options.contracts.map((contract) => contract.id);

  const hasStaking = contractIds.includes("babylon:staking");
  const hasUnbonding = contractIds.includes("babylon:unbonding");
  const hasSlashing = contractIds.includes("babylon:slashing");
  const hasSlashingBurn = contractIds.includes("babylon:slashing-burn");

  if (hasStaking && !hasUnbonding && !hasSlashing && !hasSlashingBurn) {
    return ContractType.STAKING;
  } else if (hasStaking && hasUnbonding) {
    return ContractType.UNBONDING;
  } else if (hasStaking && hasSlashing) {
    return ContractType.STAKING_SLASHING;
  } else if (hasUnbonding && hasSlashing) {
    return ContractType.UNBONDING_SLASHING;
  } else if (hasSlashingBurn) {
    return ContractType.SLASHING_BURN;
  }

  // Default case if we can't determine the type
  return undefined;
}
