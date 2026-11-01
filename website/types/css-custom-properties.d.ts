import 'react';

declare module 'react' {
  /** CSS custom properties (`--name`) set through the `style` prop. */
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style -- module augmentation must merge into React's interface.
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined;
  }
}
