import { Button, Checkbox, DialogBody, DialogFooter, DialogHeader, Radio, Text } from "@babylonlabs-io/bbn-core-ui";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { FieldControl } from "@/components/FieldControl";

export interface Props {
  className?: string;
  onSubmit?: (value: boolean, showAgain: boolean) => void;
}

export function Inscriptions({ className, onSubmit }: Props) {
  const [lockInscriptions = true, toggleInscriptions] = useState<boolean | undefined>();
  const [showAgain = true, toggleShowAgain] = useState<boolean | undefined>();

  return (
    <div className={twMerge("b-mb-8 b-flex b-flex-1 b-flex-col", className)}>
      <DialogHeader title="Bitcoin Inscriptions" className="b-mb-8">
        <Text className="b-mb-6">
          This staking interface attempts to detect bitcoin ordinals, NFTs, Runes, and other inscriptions
          (“Inscriptions”) within the Unspent Transaction Outputs (“UTXOs”) in your wallet. If you stake bitcoin with
          Inscriptions, those UTXOs may be spent on staking, unbonding, or withdrawal fees, which will cause you to lose
          those Inscriptions permanently. This interface will not detect all Inscriptions.
        </Text>

        <Text>Chose one: (you can change this later)</Text>
      </DialogHeader>

      <DialogBody>
        <form action="">
          <FieldControl
            label="Lock bitcoin UTXOs with detected Inscriptions so they will not be spent."
            className="b-mb-8"
          >
            <Radio name="inscriptions" checked={lockInscriptions} onChange={() => toggleInscriptions(true)} />
          </FieldControl>

          <FieldControl
            label="Unlock bitcoin UTXOs with detected Inscriptions in my stakable balance. I understand and agree that doing so can cause the complete and permanent loss of Inscriptions and that I am solely liable and responsible for their loss."
            className="b-mb-8"
          >
            <Radio name="inscriptions" checked={!lockInscriptions} onChange={() => toggleInscriptions(false)} />
          </FieldControl>
        </form>
      </DialogBody>

      <DialogFooter className="b-mt-auto b-pt-10">
        <Checkbox
          checked={!showAgain}
          label="Do not show again"
          labelClassName="b-mb-6"
          onChange={(value) => toggleShowAgain(!value)}
        />
        <Button fluid onClick={() => void onSubmit?.(lockInscriptions, showAgain)}>
          Save
        </Button>
      </DialogFooter>
    </div>
  );
}
