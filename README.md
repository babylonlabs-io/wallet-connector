<p align="center">
    <img
        alt="Babylon Logo"
        src="https://github.com/user-attachments/assets/b21652b5-847d-48b2-89a7-0f0969a50900"
        width="100"
    />
    <h3 align="center">@babylonlabs-io/bbn-wallet-connect</h3>
    <p align="center">Babylon Wallet Connector</p>
</p>
<br/>

> ⚠️ **IMPORTANT**: Breaking changes to the wallet methods used by the Babylon
> web application are likely to cause incompatibility with it or lead to
> unexpected behavior with severe consequences.
>
> Please make sure to always maintain backwards compatibility and test
> thoroughly all changes affecting the methods required by the Babylon web
> application. If you are unsure about a change, please reach out to the Babylon
> Labs team.

- [Key Features](#key-features)
- [Overview](#overview)
- [Installation](#installation)
- [Version Release](#version-release)
  - [Stable version](#stable-version)
- [Storybook](#storybook)
- [Wallet Integration](#wallet-integration)
  - [1. Browser extension wallets](#1-browser-extension-wallets)
  - [2. Mobile wallets](#2-mobile-wallets)

The Babylon Wallet Connector repository provides the wallet connection component
used in the Babylon Staking Dashboard. This component enables the connection of
both Bitcoin and Babylon chain wallets.

## Key Features

- Unified interfaces for Bitcoin and Babylon wallet connections
- Support for browser extension wallets
- Support for hardware wallets
- Mobile wallet compatibility through injectable interfaces
- Tomo Connect integration for broader wallet ecosystem

## Overview

The Babylon Wallet Connector provides a unified interface for integrating both
Bitcoin and Babylon wallets into Babylon dApp. It supports both native wallet
extensions and injectable mobile wallets.

The main architectural difference is that native wallets are built into the
library, while injectable wallets can be dynamically added by injecting their
implementation into the webpage's `window` object before the dApp loads.

## Installation

```bash
npm i @babylonlabs-io/bbn-wallet-connect
```

## Version Release

### Stable version

Stable release versions are manually released from the main branch.

## Storybook

```bash
npm run dev
```

## Wallet Integration

This guide explains how to integrate wallets with the Babylon staking app. The
dApp supports both Bitcoin and Babylon wallets through two integration paths:

### 1. Browser extension wallets

The recommended way to integrate your wallet with Babylon staking app is through
[Tomo Connect SDK Lite](https://docs.tomo.inc/tomo-sdk/tomo-connect-sdk-lite).
Please refer to Tomo's documentation for integration details.

### 2. Mobile wallets

Full interface definitions can be found here:

- [IBTCProvider Interface](src/core/types.ts)
- [IBBNProvider Interface](src/core/types.ts#L223)

1. Implement provider interface
2. Inject into `window` before loading dApp:

```ts
// For Bitcoin wallets
window.btcwallet = new BTCWalletImplementation();

// For Babylon wallets
window.bbnwallet = new BBNWalletImplementation();
```
