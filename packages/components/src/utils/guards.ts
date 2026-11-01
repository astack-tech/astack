/** Narrows a value to a check that a type guard performs. */
export type Guard<T> = (value: unknown) => value is T;

/** A plain object: not `null` and not an array. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** A string. */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/** A finite number. */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/** `undefined`, or a value that passes `guard`. */
export function isOptional<T>(value: unknown, guard: Guard<T>): value is T | undefined {
  return value === undefined || guard(value);
}

/** An array whose every item passes `guard`. */
export function isArrayOf<T>(value: unknown, guard: Guard<T>): value is T[] {
  return Array.isArray(value) && value.every(item => guard(item));
}
