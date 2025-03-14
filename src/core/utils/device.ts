export interface BrowserContext {
  navigator: {
    userAgent: string;
  };
  innerWidth: number;
  innerHeight: number;
  btcwallet?: any;
  bbnwallet?: any;
  chrome?: {
    runtime?: any;
    extension?: any;
  };
  browser?: {
    runtime?: any;
  };
  [key: string]: any;
}

export const getInjectableWalletName = async (
  context: BrowserContext = window as BrowserContext,
  chain: "btc" | "bbn",
): Promise<string | null> => {
  if (typeof context === "undefined") return null;

  const walletKey = chain === "btc" ? "btcwallet" : "bbnwallet";
  const wallet = context[walletKey];

  if (!wallet) return null;

  try {
    if (typeof wallet.getWalletProviderName === "function") {
      const name = await wallet.getWalletProviderName();
      if (name) return name;
    }
  } catch (error) {
    console.error("Error getting injectable wallet name:", error);
  }

  return null;
};

export const getInjectableWallets = (
  context: BrowserContext = window as BrowserContext,
): {
  btc: boolean;
  bbn: boolean;
} => {
  if (typeof context === "undefined") return { btc: false, bbn: false };

  const hasBtcWallet = typeof context.btcwallet !== "undefined";
  const hasBbnWallet = typeof context.bbnwallet !== "undefined";

  return {
    btc: hasBtcWallet,
    bbn: hasBbnWallet,
  };
};

export const hasInjectableWallets = (context: BrowserContext = window as BrowserContext): boolean => {
  const injectables = getInjectableWallets(context);
  return injectables.btc || injectables.bbn;
};

export const shouldDisplayInjectable = async (
  context: BrowserContext = window as BrowserContext,
  chainId?: string,
  nativeWalletNames: string[] = [],
): Promise<boolean> => {
  if (typeof context === "undefined") return false;

  const injectables = getInjectableWallets(context);

  if (!injectables.btc && !injectables.bbn) {
    return true;
  }

  if (!chainId) {
    return false;
  }

  const hasChainInjectable = chainId.toLowerCase() === "btc" ? injectables.btc : injectables.bbn;

  if (!hasChainInjectable) {
    return true;
  }

  if (nativeWalletNames.length > 0) {
    const injectableWalletName = await getInjectableWalletName(context, chainId.toLowerCase() as "btc" | "bbn");

    if (!injectableWalletName) {
      return false;
    }

    const isDuplicate = nativeWalletNames.some((name) => name.toLowerCase() === injectableWalletName.toLowerCase());

    if (isDuplicate) {
      return false;
    }

    return true;
  }

  return false;
};
