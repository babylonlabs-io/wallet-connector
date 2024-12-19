import { Button, ScrollLocker, Text } from "@babylonlabs-io/bbn-core-ui";
import type { Meta, StoryObj } from "@storybook/react";
import { Psbt } from "bitcoinjs-lib";
import { useEffect, useState } from "react";

import { useChainProviders } from "@/context/Chain.context";
import { IBTCProvider } from "@/core/types";
import { useWidgetState } from "@/hooks/useWidgetState";

import { config } from "./constants";
import { WalletProvider } from "./index";

const meta: Meta<typeof WalletProvider> = {
  component: WalletProvider,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onError: console.log,
  },
  decorators: [
    (Story) => (
      <ScrollLocker>
        <WalletProvider context={window.parent} config={config} onError={console.log}>
          <Story />
        </WalletProvider>
      </ScrollLocker>
    ),
  ],
  render: () => {
    const { open } = useWidgetState();

    return <Button onClick={open}>Connect Wallet</Button>;
  },
};
export const WithConnectedData: Story = {
  args: {
    onError: console.log,
  },
  decorators: [
    (Story) => (
      <ScrollLocker>
        <WalletProvider context={window.parent} config={config} onError={console.log}>
          <Story />
        </WalletProvider>
      </ScrollLocker>
    ),
  ],
  render: () => {
    const { open, selectedWallets } = useWidgetState();

    return (
      <div>
        <Button onClick={open}>Connect Wallet</Button>
        <div className="b-flex b-flex-col b-gap-4">
          {Object.entries(selectedWallets).map(
            ([chainName, wallet]) =>
              wallet?.account && (
                <div className="b-rounded b-border b-border-secondary-main/30 b-p-4">
                  <Text variant="subtitle1" className="b-mb-2">
                    {chainName} Wallet
                  </Text>
                  <Text variant="body2">Address: {wallet.account.address}</Text>
                  <Text variant="body2">Public Key: {wallet.account.publicKeyHex}</Text>
                </div>
              ),
          )}
        </div>
      </div>
    );
  },
};

export const WithBTCSigningFeatures: Story = {
  args: {
    onError: console.log,
  },
  decorators: [
    (Story) => (
      <ScrollLocker>
        <WalletProvider context={window.parent} config={config} onError={console.log}>
          <Story />
        </WalletProvider>
      </ScrollLocker>
    ),
  ],
  render: () => {
    const { open } = useWidgetState();
    const [messageToSign, setMessageToSign] = useState("");
    const [psbtToSign, setPsbtToSign] = useState("");
    const connectors = useChainProviders();
    const [walletData, setWalletData] = useState<{
      btcWallet?: IBTCProvider;
      signedMessage?: string;
      signedPsbt?: string;
    }>({});
    const [transaction, setTransaction] = useState("");

    useEffect(() => {
      const btcUnsub = connectors.BTC?.on("connect", async (wallet) => {
        if (wallet.provider) {
          setWalletData((prev) => ({
            ...prev,
            btcWallet: wallet.provider as IBTCProvider,
          }));
        }
      });

      return () => {
        btcUnsub?.();
      };
    }, [connectors]);

    const handleSignMessage = async () => {
      if (!walletData.btcWallet || !messageToSign) return;
      try {
        const signature = await walletData.btcWallet.signMessage(messageToSign, "ecdsa");
        console.log("handleSignMessage:", signature);
        setWalletData((prev) => ({
          ...prev,
          signedMessage: signature,
        }));
      } catch (error) {
        console.error("Failed to sign message:", error);
      }
    };

    const handleSignPsbt = async () => {
      if (!walletData.btcWallet || !psbtToSign) return;
      try {
        const signedPsbt = await walletData.btcWallet.signPsbt(psbtToSign);
        console.log("handleSignPsbt:", signedPsbt);
        setWalletData((prev) => ({
          ...prev,
          signedPsbt,
        }));
      } catch (error) {
        console.error("Failed to sign PSBT:", error);
      }
    };

    return (
      <div>
        <Button onClick={open}>Connect Wallet</Button>
        <div className="b-flex b-flex-col b-gap-4">
          {walletData.btcWallet && (
            <div className="b-flex b-flex-col b-gap-4">
              <div className="b-rounded b-border b-border-secondary-main/30 b-p-4">
                <Text variant="subtitle1" className="b-mb-2">
                  Sign Message
                </Text>
                <input
                  type="text"
                  value={messageToSign}
                  onChange={(e) => setMessageToSign(e.target.value)}
                  placeholder="Enter message to sign"
                  className="b-mb-2 b-w-full b-rounded b-border b-p-2"
                />
                <Button onClick={handleSignMessage}>Sign Message</Button>
                {walletData.signedMessage && (
                  <div className="b-mt-2 b-flex b-items-center b-gap-2">
                    <Text variant="body2" className="b-flex-1 b-truncate">
                      Signed Message: {walletData.signedMessage}
                    </Text>
                    <Button onClick={() => setWalletData((prev) => ({ ...prev, signedMessage: undefined }))}>
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              <div className="b-rounded b-border b-border-secondary-main/30 b-p-4">
                <Text variant="subtitle1" className="b-mb-2">
                  Sign PSBT
                </Text>
                <input
                  type="text"
                  value={psbtToSign}
                  onChange={(e) => setPsbtToSign(e.target.value)}
                  placeholder="Enter PSBT hex"
                  className="b-mb-2 b-w-full b-rounded b-border b-p-2"
                />
                <Button onClick={handleSignPsbt}>Sign PSBT</Button>
                {walletData.signedPsbt && (
                  <div className="b-mt-2 b-flex b-items-center b-gap-2">
                    <Text variant="body2" className="b-flex-1 b-truncate">
                      Signed PSBT: {walletData.signedPsbt}
                    </Text>
                    <Button
                      onClick={() => {
                        setTransaction("");
                        setWalletData((prev) => ({ ...prev, signedPsbt: undefined }));
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                )}
                {walletData.signedPsbt && (
                  <div className="b-mt-2 b-flex b-items-center b-gap-2">
                    <Text variant="body2" className="b-flex-1 b-truncate">
                      Transaction: {transaction}
                    </Text>
                    <Button
                      onClick={() => {
                        if (!walletData.signedPsbt) return;
                        try {
                          const tx = Psbt.fromHex(walletData.signedPsbt).extractTransaction().toHex();
                          console.log("Extracted transaction:", tx);
                          setTransaction(tx);
                        } catch (error) {
                          console.error("Failed to extract transaction:", error);
                        }
                      }}
                    >
                      Extract transaction
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
};
