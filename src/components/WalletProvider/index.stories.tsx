import { SigningStep } from "@babylonlabs-io/btc-staking-ts";
import { Button, FormControl, Input, ScrollLocker, Text } from "@babylonlabs-io/core-ui";
import * as ecc from "@bitcoin-js/tiny-secp256k1-asmjs";
import type { Meta, StoryObj } from "@storybook/react";
import { initEccLib, Psbt } from "bitcoinjs-lib";
import { useState } from "react";

initEccLib(ecc);

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
  decorators: [
    (Story) => (
      <ScrollLocker>
        <WalletProvider persistent context={window.parent} config={config} onError={console.log}>
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
        <div className="flex flex-col gap-4">
          {Object.entries(selectedWallets).map(
            ([chainName, wallet]) =>
              wallet?.account && (
                <div
                  className="rounded border border-secondary-main/30 p-4"
                  key={chainName}
                  data-testid={`${chainName.toLowerCase()}-wallet-section`}
                >
                  <Text variant="subtitle1" className="mb-2">
                    {chainName} Wallet
                  </Text>
                  <Text variant="body2" data-testid={`${chainName.toLowerCase()}-wallet-address`}>
                    Address: {wallet.account.address}
                  </Text>
                  <Text variant="body2" data-testid={`${chainName.toLowerCase()}-wallet-pubkey`}>
                    Public Key: {wallet.account.publicKeyHex}
                  </Text>
                </div>
              ),
          )}
        </div>
      </div>
    );
  },
};

export const WithBTCSigningFeatures: Story = {
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
    const [messageToSignECDSA, setMessageToSignECDSA] = useState("");
    const [messageToSignBIP322, setMessageToSignBIP322] = useState("");
    const [psbtToSign, setPsbtToSign] = useState("");
    const [signedMessageECDSA, setSignedMessageECDSA] = useState("");
    const [signedMessageBIP322, setSignedMessageBIP322] = useState("");
    const [signedPsbt, setSignedPsbt] = useState("");
    const [transaction, setTransaction] = useState("");

    const btcProvider = selectedWallets.BTC?.provider as IBTCProvider | undefined;

    const handleSignMessageECDSA = async () => {
      if (!btcProvider || !messageToSignECDSA) return;

      try {
        const signature = await btcProvider.signMessage(messageToSignECDSA, "ecdsa");
        console.log("handleSignMessage ECDSA:", signature);
        setSignedMessageECDSA(signature);
      } catch (error) {
        console.error("Failed to sign message:", error);
      }
    };

    const handleSignMessageBIP322 = async () => {
      if (!btcProvider || !messageToSignBIP322) return;

      try {
        const signature = await btcProvider.signMessage(messageToSignBIP322, "bip322-simple");
        console.log("handleSignMessage BIP322:", signature);
        setSignedMessageBIP322(signature);
      } catch (error) {
        console.error("Failed to sign message:", error);
      }
    };

    const handleSignPsbt = async () => {
      if (!btcProvider || !psbtToSign) return;
      try {
        const st =
          "70736274ff0100890200000001e0bed72d5e55bfdac79b4e4b8812b1fc414e4dd50c728524bc48365dd1b22c5b0100000000ffffffff0250c3000000000000225120f253728a3dbeae8529ceea4796641396981e8bae79b9d1aebe1d32000f6c9b48b93a0000000000002251203a18ecbd4cd6cb2e00ce03dcc85dab18bbb6d637943350fa3d9c77f65ec88f01000000000001012bc2fe0000000000002251203a18ecbd4cd6cb2e00ce03dcc85dab18bbb6d637943350fa3d9c77f65ec88f010117208156406fa3a7e73ff514a9051c0a4554a7142524a41aaaaafc879c6897021167000000";
        const stakingOptions = {
          type: SigningStep.STAKING as const,
          covenantPks: [
            "a10a06bb3bae360db3aef0326413b55b9e46bf20b9a96fc8a806a99e644fe277",
            "6f13a6d104446520d1757caec13eaf6fbcf29f488c31e0107e7351d4994cd068",
            "a5e21514682b87e37fb5d3c9862055041d1e6f4cc4f3034ceaf3d90f86b230a6",
          ],
          covenantThreshold: 2,
          finalityProviderPk: "d23c2c25e1fcf8fd1c21b9a402c19e2e309e531e45e92fb1e9805b6056b0cc76",
          stakingTimelockBlocks: 150,
        };
        // const signedPsbt = await btcProvider.signPsbt(psbtToSign, stakingOptions);
        const unb =
          "70736274ff01005e02000000010a94efcd45a4a429c4858d31e47a2b512c8cff462630ea24a649801634c514520000000000ffffffff0180bb000000000000225120990ba526acc27730f0bb5ba4ccae69ee89f84385ac40becb76f21fa4194a0755000000000001012b50c30000000000002251202937d103602f58d99f94fb738b4f3f99f1a427c479e5fd84aaeb886cf5d874ec6215c050929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac07f8d260ad0559ae042e6d028633552af14200a6052bd13dd1e8fac263b0f0aca0350712bb53ffe5cd246479b612a85d6bf159009152c175fc3481b8bb235e0638b208156406fa3a7e73ff514a9051c0a4554a7142524a41aaaaafc879c6897021167ad206f13a6d104446520d1757caec13eaf6fbcf29f488c31e0107e7351d4994cd068ac20a10a06bb3bae360db3aef0326413b55b9e46bf20b9a96fc8a806a99e644fe277ba20a5e21514682b87e37fb5d3c9862055041d1e6f4cc4f3034ceaf3d90f86b230a6ba529cc001172050929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac00000";
        const unbondingOptions = {
          type: SigningStep.UNBONDING as const,
          covenantPks: [
            "a10a06bb3bae360db3aef0326413b55b9e46bf20b9a96fc8a806a99e644fe277",
            "6f13a6d104446520d1757caec13eaf6fbcf29f488c31e0107e7351d4994cd068",
            "a5e21514682b87e37fb5d3c9862055041d1e6f4cc4f3034ceaf3d90f86b230a6",
          ],
          covenantThreshold: 2,
          finalityProviderPk: "d23c2c25e1fcf8fd1c21b9a402c19e2e309e531e45e92fb1e9805b6056b0cc76",
          unbondingTimelockBlocks: 101,
        };
        let options;
        if (psbtToSign === st) {
          options = stakingOptions;
        } else if (psbtToSign === unb) {
          options = unbondingOptions;
        }
        const signedPsbt = await btcProvider.signPsbt(psbtToSign, options);
        // const signedPsbt = await btcProvider.signPsbt(psbtToSign);
        console.log("handleSignPsbt:", signedPsbt);
        setSignedPsbt(signedPsbt);
      } catch (error) {
        console.error("Failed to sign PSBT:", error);
      }
    };

    return (
      <div>
        <Button className="mb-4" onClick={open}>
          Connect Wallet
        </Button>

        <div className="flex flex-col gap-4">
          {btcProvider && (
            <div className="flex flex-col gap-4">
              <div className="rounded border border-secondary-main/30 p-4">
                <FormControl label="Sign Message - ECDSA" className="mb-2 py-2">
                  <Input
                    type="text"
                    value={messageToSignECDSA}
                    onChange={(e) => setMessageToSignECDSA(e.target.value)}
                    placeholder="Enter message to sign"
                  />
                </FormControl>

                <Button onClick={handleSignMessageECDSA}>Sign Message ECDSA</Button>

                {signedMessageECDSA && (
                  <div className="mt-2 flex items-center gap-2">
                    <Text variant="body2" className="flex-1 truncate">
                      Signed Message: {signedMessageECDSA}
                    </Text>
                    <Button onClick={() => setSignedMessageECDSA("")}>Delete</Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded border border-secondary-main/30 p-4">
                  <FormControl label="Sign Message - BIP322" className="mb-2 py-2">
                    <Input
                      type="text"
                      value={messageToSignBIP322}
                      onChange={(e) => setMessageToSignBIP322(e.target.value)}
                      placeholder="Enter message to sign"
                    />
                  </FormControl>

                  <Button onClick={handleSignMessageBIP322}>Sign Message BIP322</Button>

                  {signedMessageBIP322 && (
                    <div className="mt-2 flex items-center gap-2">
                      <Text variant="body2" className="flex-1 truncate">
                        Signed Message: {signedMessageBIP322}
                      </Text>
                      <Button onClick={() => setSignedMessageBIP322("")}>Delete</Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded border border-secondary-main/30 p-4">
                <FormControl label="Sign PSBT" className="mb-2 py-2">
                  <Input
                    type="text"
                    value={psbtToSign}
                    onChange={(e) => setPsbtToSign(e.target.value)}
                    placeholder="Enter PSBT hex"
                  />
                </FormControl>

                <Button onClick={handleSignPsbt}>Sign PSBT</Button>

                {signedPsbt && (
                  <div className="mt-2 flex items-center gap-2">
                    <Text variant="body2" className="flex-1 truncate">
                      Signed PSBT: {signedPsbt}
                    </Text>
                    <Button
                      onClick={() => {
                        setTransaction("");
                        setSignedPsbt("");
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                )}

                {signedPsbt && (
                  <div className="mt-2 flex items-center gap-2">
                    <Text variant="body2" className="flex-1 truncate">
                      Transaction: {transaction}
                    </Text>
                    <Button
                      onClick={() => {
                        if (!signedPsbt) return;

                        try {
                          const tx = Psbt.fromHex(signedPsbt).extractTransaction().toHex();
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
