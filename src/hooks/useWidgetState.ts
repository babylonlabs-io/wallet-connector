import { useContext } from "react";
import { StateContext } from "@/state/state";

export const useWidgetState = () => useContext(StateContext);
