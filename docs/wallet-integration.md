# Table of Contents

- [Table of Contents](#table-of-contents)
  - [Wallet Integration](#wallet-integration)
    - [1. Integration Through Tomo Connect SDK Lite (Recommended)](#1-integration-through-tomo-connect-sdk-lite-recommended)
    - [2. Direct Native Integration](#2-direct-native-integration)
    - [Supported Wallet Types](#supported-wallet-types)
      - [Bitcoin Wallets](#bitcoin-wallets)
      - [Babylon Wallets](#babylon-wallets)
    - [Integration Process](#integration-process)
      - [1. Implement Provider Interface](#1-implement-provider-interface)
      - [2. Integration Method](#2-integration-method)

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

### 1. Integration Through Tomo Connect SDK Lite (Recommended)

The recommended way to integrate your wallet with Babylon staking app is through
[Tomo Connect SDK Lite](https://docs.tomo.inc/tomo-sdk/tomo-connect-sdk-lite).
This provides:

- Simplified integration process
- Broader wallet ecosystem access
- Maintained by Tomo team

We strongly encourage wallet developers to integrate via Tomo Connect first.
Please refer to Tomo's documentation for integration details.

### 2. Direct Native Integration

Direct native integration should only be considered if Tomo Connect integration
is not feasible for your use case. This repository contains a set of natively
integrated wallets that are maintained by the Babylon team.

### Supported Wallet Types

#### Bitcoin Wallets

Both native and injectable wallets must implement the `IBTCProvider` interface.

1. Native Wallets

- Browser extension wallets like `OKX` and `OneKey`
- Hardware wallets like `Keystone`
- Note: Native wallet integrations are managed by the Babylon team

2. Injectable Wallets

- No repository changes required
- Must inject implementation into `window.btcwallet`
- Common in mobile wallet browsers

#### Babylon Wallets

Both native and injectable wallets must implement the `IBBNProvider` interface.

1. Native Wallets

- Browser extension wallets like Keplr
- Note: Native wallet integrations are managed by the Babylon team

2. Injectable Wallets

- No repository changes required
- Must inject implementation into `window.bbnwallet`
- Common in mobile wallet browsers

### Integration Process

#### 1. Implement Provider Interface

Choose the appropriate interface based on your wallet type. Full interface
definitions can be found here:

- [IBTCProvider Interface](../src/core/types.ts#L135)
- [IBBNProvider Interface](../src/core/types.ts#L218)

#### 2. Integration Method

For Native Wallets:

1. Create wallet provider implementation
2. Create wallet metadata file

Example metadata for BTC wallet:

```ts
const metadata: WalletMetadata<IBTCProvider, BTCConfig> = {
  id: "wallet-id",
  name: WALLET_PROVIDER_NAME,
  icon: logo,
  docs: "https://docs.example.com",
  wallet: "window-key", // Global window key to detect wallet
  createProvider: (wallet, config) => new WalletProvider(wallet, config),
  networks: [Network.MAINNET, Network.SIGNET], // Supported networks
};
```

For Injectable Wallets:

1. Implement provider interface
2. Inject into `window` before loading dApp:

```ts
// For Bitcoin wallets
window.btcwallet = new BTCWalletImplementation();

// For Babylon wallets
window.bbnwallet = new BBNWalletImplementation();
```
