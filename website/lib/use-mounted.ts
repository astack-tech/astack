import { useSyncExternalStore } from 'react';

const subscribe = (): (() => void) => () => undefined;

/**
 * Returns false during server rendering and hydration, then true.
 * Use it to gate output that depends on browser-only state, such as the theme or
 * the reduced-motion preference, without a hydration mismatch.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
