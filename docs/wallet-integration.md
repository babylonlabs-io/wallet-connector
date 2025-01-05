- [Wallet Integration](#wallet-integration)
  - [1. Browser extension wallets](#1-browser-extension-wallets)
  - [2. Mobile wallets](#2-mobile-wallets)

> ⚠️ **IMPORTANT WARNING**
>
> Making breaking changes to wallet implementations **will cause severe issues**
> and unexpected behavior.
>
> - Always maintain backwards compatibility
> - Test thoroughly before deploying changes
>
> If you're unsure about a change, please reach out to the Babylon team.

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
