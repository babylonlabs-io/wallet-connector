import { useWidgetState } from "@/hooks/useWidgetState";
import { ConnectedWallet } from "./index";

interface ConnectedWalletProps {
  className?: string;
  chainId: string;
  logo: string;
  name: string;
  address: string;
}

export default function ConnectedWalletContainer(props: ConnectedWalletProps) {
  const { removeWallet } = useWidgetState();

  return <ConnectedWallet onDisconnect={removeWallet} {...props} />;
}
