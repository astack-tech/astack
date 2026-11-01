/**
 * Minimal logger used by components. Output is disabled unless `enabled` is true.
 */
export interface Logger {
  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}

const noop = (): void => undefined;

/**
 * Creates a logger that prefixes every line with `[scope]`.
 *
 * @param scope Short component name, for example `Agent`.
 * @param enabled When false, every method is a no-op.
 */
export function createLogger(scope: string, enabled: boolean): Logger {
  if (!enabled) {
    return { debug: noop, info: noop, warn: noop, error: noop };
  }

  const prefix = `[${scope}]`;
  /* eslint-disable no-console -- this module is the single console sink for verbose mode. */
  return {
    debug: (...args) => {
      console.debug(prefix, ...args);
    },
    info: (...args) => {
      console.info(prefix, ...args);
    },
    warn: (...args) => {
      console.warn(prefix, ...args);
    },
    error: (...args) => {
      console.error(prefix, ...args);
    },
  };
  /* eslint-enable no-console */
}
