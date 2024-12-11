import type { BTCConfig, Fees, InscriptionIdentifier, UTXO, WalletInfo } from "@/core/types";
import { Network } from "@/core/types";
import { BTCProvider } from "@/core/wallets/btc/BTCProvider";

export const tomoProvider = "tomo_btc";

const INTERNAL_NETWORK_NAMES = {
  [Network.MAINNET]: "mainnet",
  [Network.TESTNET]: "testnet",
  [Network.SIGNET]: "signet",
};

export class TomoProvider extends BTCProvider {
  private provider: any;
  private walletInfo: WalletInfo | undefined;

  constructor(wallet: any, config: BTCConfig) {
    super(config);

    // check whether there is Tomo extension
    if (!wallet) {
      throw new Error("Tomo Wallet extension not found");
    }

    this.provider = wallet;
  }

  connectWallet = async (): Promise<void> => {
    try {
      // Switch to the required network
      await this.provider.switchNetwork(INTERNAL_NETWORK_NAMES[this.config.network]);

      await this.provider.requestAccounts();
    } catch (error) {
      if ((error as Error)?.message?.includes("rejected")) {
        throw new Error("Connection to Bitget Wallet was rejected");
      } else {
        throw new Error((error as Error)?.message);
      }
    }

    let addresses = null;
    let publicKeyHex = null;
    try {
      // this will not throw an error even if user has no BTC Signet enabled
      addresses = await this.provider.connectWallet();
      publicKeyHex = await this.provider.getPublicKey();
      if (!addresses || addresses.length === 0 || !publicKeyHex) {
        throw new Error("BTC is not enabled in Tomo Wallet");
      }
    } catch {
      throw new Error("BTC is not enabled in Tomo Wallet");
    }

    if (publicKeyHex && addresses[0]) {
      this.walletInfo = {
        publicKeyHex,
        address: addresses[0],
      };
    } else {
      throw new Error("Could not connect to Bitget Wallet");
    }
  };

  getWalletProviderName = async (): Promise<string> => {
    return "Tomo";
  };

  getAddress = async (): Promise<string> => {
    if (!this.walletInfo) throw new Error("Tomo Wallet not connected");

    return this.walletInfo.address;
  };

  getPublicKeyHex = async (): Promise<string> => {
    if (!this.walletInfo) throw new Error("Tomo Wallet not connected");

    return this.walletInfo.publicKeyHex;
  };

  signPsbt = async (psbtHex: string): Promise<string> => {
    if (!this.walletInfo) throw new Error("Tomo Wallet not connected");
    if (!psbtHex) throw new Error("psbt hex is required");

    return await this.provider.signPsbt(psbtHex);
  };

  signPsbts = async (psbtsHexes: string[]): Promise<string[]> => {
    if (!this.walletInfo) throw new Error("Tomo Wallet not connected");
    if (!psbtsHexes && !Array.isArray(psbtsHexes)) throw new Error("psbts hexes are required");

    return await this.provider.signPsbts(psbtsHexes);
  };

  signMessageBIP322 = async (message: string): Promise<string> => {
    if (!this.walletInfo) throw new Error("Tomo Wallet not connected");

    return await this.provider.signMessage(message, "bip322-simple");
  };

  signMessage = async (message: string, type: "ecdsa" | "bip322-simple" = "ecdsa"): Promise<string> => {
    if (!this.walletInfo) throw new Error("Tomo Wallet not connected");

    return await this.provider.signMessage(message, type);
  };

  getNetwork = async (): Promise<Network> => {
    const internalNetwork = await this.provider.getNetwork();

    for (const [key, value] of Object.entries(INTERNAL_NETWORK_NAMES)) {
      if (value === internalNetwork) {
        return key as Network;
      }
    }

    throw new Error("Unsupported network");
  };

  on = (eventName: string, callBack: () => void) => {
    if (!this.walletInfo) throw new Error("Tomo Wallet not connected");

    return this.provider.on(eventName, callBack);
  };

  off = (eventName: string, callBack: () => void) => {
    if (!this.walletInfo) throw new Error("Tomo Wallet not connected");

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

  getInscriptions = async (): Promise<InscriptionIdentifier[]> => {
    throw new Error("Method not implemented.");
  };
}
