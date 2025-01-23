import { Dialog, DialogProps, MobileDialog } from "@babylonlabs-io/bbn-core-ui";

import { useIsMobileView } from "@/hooks/useIsMobileView";

export function ResponsiveDialog(props: DialogProps) {
  const isMobileView = useIsMobileView();
  const DialogComponent = isMobileView ? MobileDialog : Dialog;

  return <DialogComponent {...props} />;
}
