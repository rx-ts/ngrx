import { Arrayable } from '../../types/public-api'

import { Locale } from './constants'

export interface Translation {
  [key: string]: Arrayable<string | number | boolean | Translation>
}

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
