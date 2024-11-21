import Chains from "@/components/Chains";
import Wallets from "@/components/Wallets";
import { Inscriptions } from "@/components/Inscriptions";
import { TermsOfService } from "@/components/TermsOfService";

import type { IChain, IWallet } from "@/core/types";
import type { Screen } from "@/state/types";

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
  INSCRIPTIONS: ({ onToggleInscriptions }: ScreenProps) => <Inscriptions onSubmit={onToggleInscriptions} />,
  EMPTY: ({ className }: ScreenProps) => <div className={className} />,
} as const;

export function Screen(props: ScreenProps) {
  const CurrentScreen = SCREENS[props.current.type as keyof typeof SCREENS] ?? SCREENS.EMPTY;

  return <CurrentScreen {...props} />;
}
