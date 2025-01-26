import { Button, Checkbox, DialogBody, DialogFooter, DialogHeader, Radio, Text } from "@babylonlabs-io/bbn-core-ui";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { FieldControl } from "@/components/FieldControl";
import { BTCConfig } from "@/core/types";

export interface Props {
  className?: string;
  onSubmit?: (value: boolean, showAgain: boolean) => void;
  config?: BTCConfig;
}

export function Inscriptions({ className, config, onSubmit }: Props) {
  const [lockInscriptions = true, toggleInscriptions] = useState<boolean | undefined>();
  const [showAgain = true, toggleShowAgain] = useState<boolean | undefined>();

  if (!config) return null;

  const { coinName } = config;

  return (
    <div className={twMerge("mb-8 flex flex-1 flex-col", className)}>
      <DialogHeader
        title={`Manage ${coinName} Inscriptions`}
        className="mb-10 text-accent-primary"
        onClose={() => void onSubmit?.(lockInscriptions, showAgain)}
      >
        <Text className="pt-2 mb-8 text-accent-secondary">
          By default, we will not use {coinName} that contains Inscriptions - such as Ordinals, NFTs, or Runes - in your
          stakeable balance. This helps prevent any accidental loss of your Inscriptions due to staking, unbonding, or
          withdrawal fees.
        </Text>
        <Text className="text-accent-secondary">
          If you would like to include {coinName} with Inscriptions in your stakeable balance, please select the option
          below.
        </Text>
      </DialogHeader>
      <DialogBody>
        <form action="">
          <FieldControl
            label={
              <>
                <strong>Do not use</strong> {coinName} with Inscriptions for staking. (Recommended)
              </>
            }
            className="mb-8"
          >
            <Radio name="inscriptions" checked={lockInscriptions} onChange={() => toggleInscriptions(true)} />
          </FieldControl>

          <FieldControl
            label={
              <>
                <strong>Use</strong> {coinName} with Inscriptions in my stakable balance.
              </>
            }
            className="mb-8"
          >
            <Radio name="inscriptions" checked={!lockInscriptions} onChange={() => toggleInscriptions(false)} />
          </FieldControl>
        </form>
      </DialogBody>

      <DialogFooter className="mt-auto pt-10">
        <Checkbox
          checked={!showAgain}
          label="Do not show again"
          labelClassName="mb-6"
          onChange={(value) => toggleShowAgain(!value)}
        />

        <Button fluid onClick={() => void onSubmit?.(lockInscriptions, showAgain)}>
          Save
        </Button>
      </DialogFooter>
    </div>
  );
}
