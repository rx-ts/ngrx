import { Arrayable } from '../../types/public-api'

import { Locale } from './constants'

export interface Translation {
  // tslint:disable-next-line: max-union-size
  [key: string]: Arrayable<string | number | boolean | Translation>
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type Translations = Partial<Record<Locale, Translation>>

export type TranslateKey = string | Partial<Record<Locale, string>>

export interface TranslateOptions {
  locale?: Locale
  defaultLocale?: Locale
  locales?: Locale[]
  translations?: Translations
  loose?: boolean
  remoteTranslations?: Translations
  remoteUrl?: string
}
