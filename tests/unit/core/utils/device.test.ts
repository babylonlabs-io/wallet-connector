import { expect, test } from "@playwright/test";

import {
  BrowserContext,
  getInjectableWalletName,
  getInjectableWallets,
  hasInjectableWallets,
  shouldDisplayInjectable,
} from "../../../../src/core/utils/device";

const createMockContext = (overrides: Partial<BrowserContext> = {}): BrowserContext => {
  return {
    navigator: {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      ...overrides.navigator,
    },
    innerWidth: 1024,
    innerHeight: 768,
    ...overrides,
  };
};

global.window = createMockContext() as any;

test.describe("getInjectableWalletName", () => {
  test("returns null for undefined context", async () => {
    expect(await getInjectableWalletName(undefined as any, "btc")).toBe(null);
  });

  test("returns null when wallet is not present", async () => {
    const context = createMockContext();
    expect(await getInjectableWalletName(context, "btc")).toBe(null);
  });

  test("returns name when getWalletProviderName is available", async () => {
    const context = createMockContext({
      btcwallet: {
        getWalletProviderName: async () => "TestWallet",
      },
    });
    expect(await getInjectableWalletName(context, "btc")).toBe("TestWallet");
  });

  test("returns null when getWalletProviderName throws an error", async () => {
    const context = createMockContext({
      btcwallet: {
        getWalletProviderName: () => {
          throw new Error("Test error");
        },
      },
    });
    expect(await getInjectableWalletName(context, "btc")).toBe(null);
  });
});

test.describe("getInjectableWallets", () => {
  test("returns all false for undefined context", () => {
    expect(getInjectableWallets(undefined as any)).toEqual({ btc: false, bbn: false });
  });

  test("returns correct values when btcwallet is defined", () => {
    const context = createMockContext({
      btcwallet: {},
    });
    expect(getInjectableWallets(context)).toEqual({ btc: true, bbn: false });
  });

  test("returns correct values when bbnwallet is defined", () => {
    const context = createMockContext({
      bbnwallet: {},
    });
    expect(getInjectableWallets(context)).toEqual({ btc: false, bbn: true });
  });

  test("returns correct values when both wallets are defined", () => {
    const context = createMockContext({
      btcwallet: {},
      bbnwallet: {},
    });
    expect(getInjectableWallets(context)).toEqual({ btc: true, bbn: true });
  });

  test("returns all false when neither wallet is defined", () => {
    const context = createMockContext();
    expect(getInjectableWallets(context)).toEqual({ btc: false, bbn: false });
  });
});

test.describe("hasInjectableWallets", () => {
  test("returns false for undefined context", () => {
    expect(hasInjectableWallets(undefined as any)).toBe(false);
  });

  test("returns true when btcwallet is defined", () => {
    const context = createMockContext({
      btcwallet: {},
    });
    expect(hasInjectableWallets(context)).toBe(true);
  });

  test("returns true when bbnwallet is defined", () => {
    const context = createMockContext({
      bbnwallet: {},
    });
    expect(hasInjectableWallets(context)).toBe(true);
  });

  test("returns false when neither btcwallet nor bbnwallet is defined", () => {
    const context = createMockContext();
    expect(hasInjectableWallets(context)).toBe(false);
  });
});

test.describe("shouldDisplayInjectable", () => {
  test("returns false for undefined context", async () => {
    expect(await shouldDisplayInjectable(undefined as any)).toBe(false);
  });

  test("returns true when no injectable wallets are present", async () => {
    const context = createMockContext();
    expect(await shouldDisplayInjectable(context)).toBe(true);
  });

  test("returns false when injectable wallets are present and no chainId is provided", async () => {
    const context = createMockContext({
      btcwallet: {},
    });
    expect(await shouldDisplayInjectable(context)).toBe(false);
  });

  test("returns true when injectable wallet for a different chain is present", async () => {
    const context = createMockContext({
      btcwallet: {},
    });
    expect(await shouldDisplayInjectable(context, "bbn")).toBe(true);
  });

  test("returns false when injectable wallet matches native wallet name", async () => {
    const context = createMockContext({
      btcwallet: {
        getWalletProviderName: async () => "OneKey",
      },
    });
    expect(await shouldDisplayInjectable(context, "btc", ["OneKey", "Unisat"])).toBe(false);
  });

  test("returns true when injectable wallet does not match any native wallet name", async () => {
    const context = createMockContext({
      btcwallet: {
        getWalletProviderName: async () => "TestWallet",
      },
    });
    expect(await shouldDisplayInjectable(context, "btc", ["OneKey", "Unisat"])).toBe(true);
  });

  test("returns false when injectable wallet name cannot be determined", async () => {
    const context = createMockContext({
      btcwallet: {},
    });
    expect(await shouldDisplayInjectable(context, "btc", ["OneKey", "Unisat"])).toBe(false);
  });

  test("returns false when no native wallet names are provided", async () => {
    const context = createMockContext({
      btcwallet: {
        getWalletProviderName: async () => "TestWallet",
      },
    });
    expect(await shouldDisplayInjectable(context, "btc", [])).toBe(false);
  });
});
