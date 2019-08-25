import { Arrayable, Nullable } from '../../types/public-api'

import { Locale } from './constants'

export interface ITranslation {
  [key: string]: Arrayable<string | number | boolean | ITranslation>
}

export type Translations = Partial<Record<Locale, ITranslation>>

export type TranslateKey = string | Partial<Record<Locale, string>>

export interface ITranslateOptions {
  locale?: Locale
  defaultLocale?: Locale
  locales?: Locale[]
  translations?: Translations
  loose?: boolean
  remoteTranslations?: Translations
  remoteUrl?: Nullable<string>
}
