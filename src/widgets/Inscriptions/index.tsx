import { Text, Radio, Button, DialogBody, DialogFooter, DialogHeader, Checkbox } from "@/index";

import { FieldControl } from "@/widgets/FieldControl";
import { twMerge } from "tailwind-merge";

export interface Props {
  className?: string;
}

export function Inscriptions({ className }: Props) {
  return (
    <div className={twMerge("mb-8 flex flex-1 flex-col", className)}>
      <DialogHeader title="Bitcoin Inscriptions" className="mb-8">
        <Text className="mb-6">
          This staking interface attempts to detect bitcoin ordinals, NFTs, Ruins, and other inscriptions
          (“Inscriptions”) within the Unspent Transaction Outputs (“UTXOs”) in your wallet. If you stake bitcoin with
          Inscriptions, those UTXOs may be spent on staking, unbonding, or withdrawal fees, which will cause you to lose
          those Inscriptions permanently. This interface will not detect all Inscriptions.
        </Text>

        <Text>Chose one: (you can change this later)</Text>
      </DialogHeader>

      <DialogBody>
        <FieldControl label="Lock bitcoin UTXOs with detected Inscriptions so they will not be spent." className="mb-8">
          <Radio />
        </FieldControl>

        <FieldControl
          label="Unlock bitcoin UTXOs with detected Inscriptions in my stakable balance. I understand and agree that doing so can cause the complete and permanent loss of Inscriptions and that I am solely liable and responsible for their loss."
          className="mb-8"
        >
          <Radio />
        </FieldControl>
      </DialogBody>

      <DialogFooter className="mt-auto pt-10">
        <Checkbox label="Do not show again" labelClassName="mb-6" />
        <Button fluid>Save</Button>
      </DialogFooter>
    </div>
  );
}
