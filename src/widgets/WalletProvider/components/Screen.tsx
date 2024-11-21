import Chains from "@/widgets/Chains";
import Wallets from "@/widgets/Wallets";
import { Inscriptions } from "@/widgets/Inscriptions";
import { TermsOfService } from "@/widgets/TermsOfService";

import type { IChain, IWallet } from "@/core/types";
import type { Screen } from "@/state/state.d";

interface ScreenProps {
  current: Screen;
  className?: string;
  lockInscriptions?: boolean;
  onSelectWallet?: (chain: IChain, wallet: IWallet) => void;
  onAccepTermsOfService?: () => void;
  onToggleInscriptions?: (value: boolean, showAgain: boolean) => void;
  onClose?: () => void;
}

const SCREENS = {
  TERMS_OF_SERVICE: ({ className, onClose, onAccepTermsOfService }: ScreenProps) => (
    <TermsOfService className={className} onClose={onClose} onSubmit={onAccepTermsOfService} />
  ),
  CHAINS: ({ className, onClose }: ScreenProps) => <Chains className={className} onClose={onClose} />,
  WALLETS: ({ className, onClose, onSelectWallet }: ScreenProps) => (
    <Wallets className={className} onClose={onClose} onSelectWallet={onSelectWallet} />
  ),
  INSCRIPTIONS: ({ onToggleInscriptions }) => <Inscriptions onSubmit={onToggleInscriptions} />,
} as const;

export function Screen(props: ScreenProps) {
  const CurrentScreen = SCREENS[props.current.type] ?? SCREENS.CHAINS;

  return <CurrentScreen {...props} />;
}
