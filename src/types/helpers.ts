// eslint-disable-next-line @typescript-eslint/no-type-alias
export type AnyArray<T> = T[] | readonly T[]

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type Arrayable<T, R extends boolean = false> = [R] extends [never]
  ? T | T[]
  : R extends true
  ? Readonly<T> | readonly T[]
  : R extends false
  ? T | Readonly<T> | AnyArray<T>
  : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Callback<T extends any[] = never, R = void> = (...params: T) => R

export type Nullable<T> = T | null | undefined
