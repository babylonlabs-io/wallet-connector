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

export const isMobileDevice = (context: BrowserContext = window as BrowserContext): boolean => {
  if (typeof context === "undefined") return false;

  const userAgent = context.navigator.userAgent;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileBrowser = mobileRegex.test(userAgent);
  const hasAppSpecificIdentifiers = /OKX|Binance|Trust\/|TokenPocket|imToken/i.test(userAgent);
  const isMobileSize = context.innerWidth <= 768;

  return isMobileBrowser || hasAppSpecificIdentifiers || isMobileSize;
};

export const hasInjectableWallets = (context: BrowserContext = window as BrowserContext): boolean => {
  if (typeof context === "undefined") return false;

  const hasBtcWallet = typeof context.btcwallet !== "undefined";
  const hasBbnWallet = typeof context.bbnwallet !== "undefined";

  return hasBtcWallet || hasBbnWallet;
};

export const isBrowserExtension = (context: BrowserContext = window as BrowserContext): boolean => {
  if (typeof context === "undefined") return false;

  // Check if we're in a standard browser
  const isStandardBrowser = /Chrome|Firefox|Safari|Edge/i.test(context.navigator.userAgent);

  // Check if we're NOT in an app webview
  const isNotWebView =
    !/Android|iPhone|iPad|iPod/i.test(context.navigator.userAgent) || !/wv|WebView/i.test(context.navigator.userAgent);

  // Check if we have extension-specific objects
  const hasExtensionAPIs =
    typeof context.chrome !== "undefined" &&
    (context.chrome.runtime !== undefined || context.chrome.extension !== undefined);

  // If we're in a standard browser and not in a webview, or we have extension APIs,
  // it's likely a browser extension environment
  return (isStandardBrowser && isNotWebView) || hasExtensionAPIs;
};

export const isDesktopWalletApp = (context: BrowserContext = window as BrowserContext): boolean => {
  if (typeof context === "undefined") return false;

  const isMobile = isMobileDevice(context);

  if (isMobile) {
    return false;
  }

  const isBrowserExt = isBrowserExtension(context);

  if (isBrowserExt) {
    return false;
  }

  const hasInjectables = hasInjectableWallets(context);

  if (hasInjectables) {
    return true;
  }

  const userAgent = context.navigator.userAgent;
  const hasWalletInUserAgent = userAgent.includes("Wallet") || userAgent.includes("wallet");

  if (hasWalletInUserAgent) {
    return true;
  }

  return false;
};

/**
 * Determines if injectable wallets should be displayed based on the environment
 * @param context The window object or similar context
 * @returns True if injectable wallets should be displayed, false otherwise
 */
export const shouldDisplayInjectable = (context: BrowserContext = window as BrowserContext): boolean => {
  // Always show injectable wallets on mobile
  const isMobile = isMobileDevice(context);
  if (isMobile) {
    return true;
  }

  // On desktop, only show injectable wallets if inside a desktop wallet app
  return isDesktopWalletApp(context);
};
