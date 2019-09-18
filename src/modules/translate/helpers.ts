import { head } from 'lodash'

import { Nullable } from '../../types/public-api'

import { LOCALE_STORAGE } from './constants'

declare global {
  interface NavigatorLanguage {
    browserLanguage?: string
    userLanguage?: string
  }
}

export const getBrowserLang = () =>
  head(navigator.languages) ||
  navigator.language ||
  navigator.browserLanguage ||
  navigator.userLanguage

export const getLang = <T extends string = string>(
  LOCALES: Nullable<T[]>,
): T | undefined => {
  const lang = (localStorage.getItem(LOCALE_STORAGE) || getBrowserLang()) as T
  return !LOCALES || LOCALES.length === 0 || LOCALES.includes(lang)
    ? lang
    : LOCALES[0]
}
