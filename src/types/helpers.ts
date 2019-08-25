export type AnyArray<T> = T[] | ReadonlyArray<T>

export type Arrayable<T, R extends boolean = false> = [R] extends [never]
  ? T | T[]
  : R extends true
  ? Readonly<T> | ReadonlyArray<T>
  : R extends false
  ? T | Readonly<T> | AnyArray<T>
  : never

export type Callback<T extends any[] = never, R = void> = (...params: T) => R

export type Nullable<T> = T | null | undefined
