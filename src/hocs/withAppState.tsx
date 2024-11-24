/* eslint-disable @typescript-eslint/no-empty-object-type */
import { ComponentType, memo, useMemo } from "react";
import { useWidgetState } from "@/hooks/useWidgetState";
import type { Actions, State } from "@/state/types";

export const withAppState =
  <OP, IP = {}, P = {}>(stateMapper: (state: State & Actions) => IP) =>
  (Component: ComponentType<P>) => {
    const Container = (props: OP) => {
      const appState = useWidgetState();
      const outerProps = useMemo(() => stateMapper(appState), [appState, stateMapper]);
      const PureComponent = memo(Component);

      return <PureComponent {...(props as any)} {...outerProps} />;
    };

    return Container;
  };
