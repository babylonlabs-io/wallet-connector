import { Text, Checkbox, Button, DialogBody, DialogFooter, DialogHeader } from "@/index";

import { FieldControl } from "@/widgets/FieldControl";
import { twMerge } from "tailwind-merge";

export interface Props {
  className?: string;
  onClose?: () => void;
}

export function TermsOfService({ className, onClose }: Props) {
  return (
    <div className={twMerge("flex flex-1 flex-col", className)}>
      <DialogHeader className="mb-10" title="Connect Wallets" onClose={onClose}>
        <Text>Accept our terms of service to proceed</Text>
      </DialogHeader>

      <DialogBody>
        <FieldControl
          label="I certify that I have read and accept the updated Terms of Use and Privacy Policy."
          className="mb-8"
        >
          <Checkbox />
        </FieldControl>

        <FieldControl
          label="I certify that I wish to stake bitcoin and agree that doing so may cause some or all of the bitcoin ordinals, NFTs, Ruins, and other inscriptions in the connected bitcoin wallet to be lost. I acknowledge that this interface will not detect all Inscriptions."
          className="mb-8"
        >
          <Checkbox />
        </FieldControl>

        <FieldControl label="I acknowledge that Keystone via QR code is the only hardware wallet supporting Bitcoin Staking. Using any other hardware wallets through any means (such as connection to software / extension / mobile wallet) can lead to permanent inability to withdraw the stake.">
          <Checkbox />
        </FieldControl>
      </DialogBody>

      <DialogFooter className="mt-auto pt-10">
        <Button fluid>Next</Button>
      </DialogFooter>
    </div>
  );
}
