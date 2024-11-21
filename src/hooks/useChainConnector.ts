import { type SupportedChains, useChainProviders } from "@/context/Chain.context";

export function useChainConnector<K extends SupportedChains>(chainId: K) {
  const connectors = useChainProviders();

  return connectors?.[chainId] ?? null;
}
