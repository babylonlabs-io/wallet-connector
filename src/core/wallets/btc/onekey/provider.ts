import type { BTCConfig, Fees, InscriptionIdentifier, UTXO, WalletInfo } from "@/core/types";
import { Network } from "@/core/types";
import { validateAddress } from "@/core/utils/wallet";
import { BTCProvider } from "@/core/wallets/btc/BTCProvider";

const INTERNAL_NETWORK_NAMES = {
  [Network.MAINNET]: "livenet",
  [Network.TESTNET]: "testnet",
  [Network.SIGNET]: "signet",
};

export class OneKeyProvider extends BTCProvider {
  private provider: any;
  private walletInfo: WalletInfo | undefined;

  constructor(wallet: any, config: BTCConfig) {
    super(config);

    // check whether there is an OneKey extension
    if (!wallet?.btcwallet) {
      throw new Error("OneKey Wallet extension not found");
    }

    this.provider = wallet.btcwallet;
  }

  connectWallet = async (): Promise<void> => {
    try {
      await this.provider.connectWallet();
    } catch (error) {
      if ((error as Error)?.message?.includes("rejected")) {
        throw new Error("Connection to OneKey Wallet was rejected");
      } else {
        throw new Error((error as Error)?.message);
      }
    }

    // TODO `window.$onekey.btcwallet.switchNetwork` does not support "signet" network at the moment
    // switch (this.networkEnv) {
    //   case Network.MAINNET:
    //     await this.bitcoinNetworkProvider.switchNetwork(
    //       INTERNAL_NETWORK_NAMES.mainnet,
    //     );
    //     break;
    //   case Network.TESTNET:
    //     await this.bitcoinNetworkProvider.switchNetwork(
    //       INTERNAL_NETWORK_NAMES.testnet,
    //     );
    //     break;
    //   case Network.SIGNET:
    //     await this.bitcoinNetworkProvider.switchNetwork(
    //       INTERNAL_NETWORK_NAMES.signet,
    //     );
    //     break;
    //   default:
    //     throw new Error("Unsupported network");
    // }

    const address = await this.provider.getAddress();
    validateAddress(this.config.network, address);

    const publicKeyHex = await this.provider.getPublicKeyHex();

    if (publicKeyHex && address) {
      this.walletInfo = {
        publicKeyHex,
        address,
      };
    } else {
      throw new Error("Could not connect to OneKey Wallet");
    }
  };

  getWalletProviderName = async (): Promise<string> => {
    return "OneKey";
  };

  getAddress = async (): Promise<string> => {
    if (!this.walletInfo) throw new Error("OneKey Wallet not connected");

    return this.walletInfo.address;
  };

  getPublicKeyHex = async (): Promise<string> => {
    if (!this.walletInfo) throw new Error("OneKey Wallet not connected");

    return this.walletInfo.publicKeyHex;
  };

  signPsbt = async (psbtHex: string): Promise<string> => {
    if (!this.walletInfo) throw new Error("OneKey Wallet not connected");
    if (!psbtHex) throw new Error("psbt hex is required");

    return this.provider.signPsbt(psbtHex);
  };

  signPsbts = async (psbtsHexes: string[]): Promise<string[]> => {
    if (!this.walletInfo) throw new Error("OneKey Wallet not connected");
    if (!psbtsHexes && !Array.isArray(psbtsHexes)) throw new Error("psbts hexes are required");

    return this.provider.signPsbts(psbtsHexes);
  };

  getNetwork = async (): Promise<Network> => {
    const internalNetwork = await this.provider.getNetwork();

    for (const [key, value] of Object.entries(INTERNAL_NETWORK_NAMES)) {
      // TODO remove as soon as OneKey implements
      if (value === "testnet") {
        // in case of testnet return signet
        return Network.SIGNET;
      } else if (value === internalNetwork) {
        return key as Network;
      }
    }

    throw new Error("Unsupported network");
  };

  signMessageBIP322 = async (message: string): Promise<string> => {
    if (!this.walletInfo) throw new Error("OneKey Wallet not connected");

    return await this.provider.signMessageBIP322(message);
  };

  signMessage = async (message: string, type: "ecdsa" | "bip322-simple" = "ecdsa"): Promise<string> => {
    if (!this.walletInfo) throw new Error("OneKey Wallet not connected");

    return await this.provider.signMessage(message, type);
  };

  on = (eventName: string, callBack: () => void) => {
    if (!this.walletInfo) throw new Error("OneKey Wallet not connected");

    // subscribe to account change event: `accountChanged` -> `accountsChanged`
    if (eventName === "accountChanged") {
      return this.provider.on("accountsChanged", callBack);
    }
    return this.provider.on(eventName, callBack);
  };

  off = (eventName: string, callBack: () => void) => {
    if (!this.walletInfo) throw new Error("OneKey Wallet not connected");

    // unsubscribe to account change event
    if (eventName === "accountChanged") {
      return this.provider.off("accountsChanged", callBack);
    }
    return this.provider.off(eventName, callBack);
  };

  // Mempool calls
  getBalance = async (): Promise<number> => {
    return await this.mempool.getAddressBalance(await this.getAddress());
  };

  getNetworkFees = async (): Promise<Fees> => {
    return await this.mempool.getNetworkFees();
  };

  pushTx = async (txHex: string): Promise<string> => {
    return await this.mempool.pushTx(txHex);
  };

  getUtxos = async (address: string, amount: number): Promise<UTXO[]> => {
    return await this.mempool.getFundingUTXOs(address, amount);
  };

  getBTCTipHeight = async (): Promise<number> => {
    return await this.mempool.getTipHeight();
  };

  // Inscriptions are only available on OneKey Wallet BTC mainnet
  getInscriptions = async (): Promise<InscriptionIdentifier[]> => {
    if (!this.walletInfo) throw new Error("OneKey Wallet not connected");
    if (this.config.network !== Network.MAINNET) {
      throw new Error("Inscriptions are only available on OneKey Wallet BTC Mainnet");
    }

    // max num of iterations to prevent infinite loop
    const MAX_ITERATIONS = 100;
    // Fetch inscriptions in batches of 100
    const limit = 100;
    const inscriptionIdentifiers: InscriptionIdentifier[] = [];
    let cursor = 0;
    let iterations = 0;
    try {
      while (iterations < MAX_ITERATIONS) {
        const { list } = await this.provider.getInscriptions(cursor, limit);
        const identifiers = list.map((i: { output: string }) => {
          const [txid, vout] = i.output.split(":");
          return {
            txid,
            vout,
          };
        });
        inscriptionIdentifiers.push(...identifiers);
        if (list.length < limit) {
          break;
        }
        cursor += limit;
        iterations++;
        if (iterations >= MAX_ITERATIONS) {
          throw new Error("Exceeded maximum iterations when fetching inscriptions");
        }
      }
    } catch {
      throw new Error("Failed to get inscriptions from OneKey Wallet");
    }

    return inscriptionIdentifiers;
  };
}
