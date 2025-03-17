import { initBTCCurve } from "@babylonlabs-io/btc-staking-ts";
import { HDKey } from "@scure/bip32";
import { Network as BitcoinNetwork, payments } from "bitcoinjs-lib";
import { toXOnly } from "bitcoinjs-lib/src/psbt/bip371";

export const formatAddress = (str: string, symbols: number = 8) => {
  if (str.length <= symbols) {
    return str;
  } else if (symbols === 0) {
    return "...";
  }

  return `${str.slice(0, symbols / 2)}...${str.slice(-symbols / 2)}`;
};

/**
 * Generates the p2tr Bitcoin address from an extended public key and a path.
 * @param xpub - The extended public key.
 * @param path - The derivation path.
 * @param network - The Bitcoin network.
 * @returns The Bitcoin address and the public key as a hex string.
 */
export const generateP2TRAddressFromXpub = (
  xpub: string,
  path: string,
  network: BitcoinNetwork,
): { address: string; publicKeyHex: string; scriptPubKeyHex: string } => {
  const hdNode = HDKey.fromExtendedKey(xpub, network.bip32);
  const derivedNode = hdNode.derive(path);
  const pubkeyBuffer = Buffer.from(derivedNode.publicKey!);
  const childNodeXOnlyPubkey = toXOnly(pubkeyBuffer);
  let address: string;
  let output: Buffer;
  try {
    const res = payments.p2tr({
      internalPubkey: childNodeXOnlyPubkey,
      network,
    });
    address = res.address!;
    output = res.output!;
  } catch (error: Error | any) {
    if (error instanceof Error && error.message.includes("ECC")) {
      // initialize the BTC curve if not already initialized
      initBTCCurve();
      const res = payments.p2tr({
        internalPubkey: childNodeXOnlyPubkey,
        network,
      });
      address = res.address!;
      output = res.output!;
    } else {
      throw new Error(error);
    }
  }
  return {
    address: address!,
    publicKeyHex: pubkeyBuffer.toString("hex"),
    scriptPubKeyHex: output!.toString("hex"),
  };
};
