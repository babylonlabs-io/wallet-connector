- [Wallet Integration](#wallet-integration)
  - [1. Browser extension wallets](#1-browser-extension-wallets)
  - [2. Mobile wallets](#2-mobile-wallets)

> ⚠️ **IMPORTANT**: Breaking changes to the wallet methods used by the Babylon
> web application are likely to cause incompatibility with it or lead to
> unexpected behavior with severe consequences.
>
> Please make sure to always maintain backwards compatibility and test
> thoroughly all changes affecting the methods required by the Babylon web
> application. If you are unsure about a change, please reach out to the Babylon
> Labs team.

## Wallet Integration

This guide explains how to integrate wallets with the Babylon staking app. The
dApp supports both Bitcoin and Babylon wallets through two integration paths:

### 1. Browser extension wallets

The recommended way to integrate your wallet with Babylon staking app is through
[Tomo Connect SDK Lite](https://docs.tomo.inc/tomo-sdk/tomo-connect-sdk-lite).
Please refer to Tomo's documentation for integration details.

### 2. Mobile wallets

Full interface definitions can be found here:

- [IBTCProvider Interface](../src/core/types.ts#L135)
- [IBBNProvider Interface](../src/core/types.ts#L218)

1. Implement provider interface
2. Inject into `window` before loading dApp:

```ts
// For Bitcoin wallets
window.btcwallet = new BTCWalletImplementation();

// For Babylon wallets
window.bbnwallet = new BBNWalletImplementation();
```
