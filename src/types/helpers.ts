export type Callback<T extends any[] = never, R = void> = (...params: T) => R

export type Nullable<T> = T | null | undefined
