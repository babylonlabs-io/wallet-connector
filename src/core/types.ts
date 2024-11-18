export type Fees = {
  // fee for inclusion in the next block
  fastestFee: number;
  // fee for inclusion in a block in 30 mins
  halfHourFee: number;
  // fee for inclusion in a block in 1 hour
  hourFee: number;
  // economy fee: inclusion not guaranteed
  economyFee: number;
  // minimum fee: the minimum fee of the network
  minimumFee: number;
};

// UTXO is a structure defining attributes for a UTXO
export interface UTXO {
  // hash of transaction that holds the UTXO
  txid: string;
  // index of the output in the transaction
  vout: number;
  // amount of satoshis the UTXO holds
  value: number;
  // the script that the UTXO contains
  scriptPubKey: string;
}

export interface InscriptionIdentifier {
  // hash of transaction that holds the ordinals/brc-2-/runes etc in the UTXO
  txid: string;
  // index of the output in the transaction
  vout: number;
}
// supported networks
export enum Network {
  MAINNET = "mainnet",
  TESTNET = "testnet",
  SIGNET = "signet",
}

// WalletInfo is a structure defining attributes for a wallet
export type WalletInfo = {
  publicKeyHex: string;
  address: string;
};

export interface NetworkConfig {
  coinName: string;
  coinSymbol: string;
  networkName: string;
  mempoolApiUrl: string;
  network: Network;
}

export interface IProvider {
  connectWallet: () => Promise<this>;
}

export interface IWallet {
  id: string;
  name: string;
  icon: string;
  docs: string;
  installed: boolean;
  provider: IProvider | null;
}

export interface IChain {
  chain: string;
  icon: string;
  wallets: IWallet[];
}

export interface WalletMetadata<P extends IProvider> {
  id: string;
  wallet?: string | ((context: any, config: NetworkConfig) => any);
  name: string | ((wallet: any, config: NetworkConfig) => Promise<string>);
  icon: string | ((wallet: any, config: NetworkConfig) => Promise<string>);
  docs: string;
  networks: Network[];
  createProvider: (wallet: any, config: NetworkConfig) => P;
}

export interface ConnectMetadata<P extends IProvider> {
  chain: string;
  icon: string;
  wallets: WalletMetadata<P>[];
}
