import { head } from 'lodash'

import { LOCALE_STORAGE } from './constants'

declare global {
  // tslint:disable-next-line: interface-name
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
  LOCALES: T[],
): T | undefined => {
  const lang = (localStorage.getItem(LOCALE_STORAGE) || getBrowserLang()) as T
  return !LOCALES || !LOCALES.length || LOCALES.includes(lang)
    ? lang
    : LOCALES[0]
}
