export type Satisfies<T extends U, U> = T;
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type Compute<T> = { [K in keyof T]: T[K] } & unknown;
export type Overwrite<T, U> = Compute<Omit<T, keyof U> & U>;

export const safeAssign: <T extends object>(
  target: T,
  ...sources: Array<Partial<T>>
) => T = Object.assign;
