import * as ecc from "@bitcoin-js/tiny-secp256k1-asmjs";
import { initEccLib, networks, payments } from "bitcoinjs-lib";
import { toXOnly } from "bitcoinjs-lib/src/psbt/bip371";

import { Network } from "@/core/types";
export const COMPRESSED_PUBLIC_KEY_HEX_LENGTH = 66;

initEccLib(ecc);

const NETWORKS = {
  [Network.MAINNET]: {
    name: "Mainnet",
    config: networks.bitcoin,
    prefix: {
      common: "bc1",
      nativeSegWit: "bc1q",
      taproot: "bc1p",
    },
  },
  [Network.CANARY]: {
    name: "Canary",
    config: networks.bitcoin,
    prefix: {
      common: "bc1",
      nativeSegWit: "bc1q",
      taproot: "bc1p",
    },
  },
  [Network.TESTNET]: {
    name: "Testnet",
    config: networks.testnet,
    prefix: {
      common: "tb1",
      nativeSegWit: "tb1q",
      taproot: "tb1p",
    },
  },
  [Network.SIGNET]: {
    name: "Signet",
    config: networks.testnet,
    prefix: {
      common: "tb1",
      nativeSegWit: "tb1q",
      taproot: "tb1p",
    },
  },
};

export const getTaprootAddress = (publicKey: string, network: Network) => {
  if (publicKey.length == COMPRESSED_PUBLIC_KEY_HEX_LENGTH) {
    publicKey = publicKey.slice(2);
  }

  const internalPubkey = Buffer.from(publicKey, "hex");
  const { address, output: scriptPubKey } = payments.p2tr({
    internalPubkey: toXOnly(internalPubkey),
    network: NETWORKS[network].config,
  });

  if (!address || !scriptPubKey) {
    throw new Error("Failed to generate taproot address or script from public key");
  }

  return address;
};

export const getNativeSegwitAddress = (publicKey: string, network: Network) => {
  if (publicKey.length !== COMPRESSED_PUBLIC_KEY_HEX_LENGTH) {
    throw new Error("Invalid public key length for generating native segwit address");
  }

  const internalPubkey = Buffer.from(publicKey, "hex");
  const { address, output: scriptPubKey } = payments.p2wpkh({
    pubkey: internalPubkey,
    network: NETWORKS[network].config,
  });

  if (!address || !scriptPubKey) {
    throw new Error("Failed to generate native segwit address or script from public key");
  }

  return address;
};

export function validateAddressWithPK(address: string, publicKey: string, network: Network) {
  if (address.startsWith(NETWORKS[network].prefix.taproot)) {
    return address === getTaprootAddress(publicKey, network);
  }

  if (address.startsWith(NETWORKS[network].prefix.nativeSegWit)) {
    return address === getNativeSegwitAddress(publicKey, network);
  }

  return false;
}

export function validateAddress(network: Network, address: string): void {
  const { prefix, name } = NETWORKS[network];

  if (!(network in NETWORKS)) {
    throw new Error(`Unsupported network: ${network}. Please provide a valid network.`);
  }

  if (!address.startsWith(prefix.common)) {
    throw new Error(`Incorrect address prefix for ${name}. Expected address to start with '${prefix}'.`);
  }
}

export const toNetwork = (network: Network): networks.Network => NETWORKS[network].config;
