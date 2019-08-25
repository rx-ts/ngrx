import { InjectionToken } from '@angular/core'

import { Locale } from './constants'
import { Translations } from './types'

export const TOKEN_LOCALE = new InjectionToken<Locale>(
  'initialize and runtime locale',
)

export const TOKEN_DEFAULT_LOCALE = new InjectionToken<Locale>(
  'fallback locale if translation for current locale found',
)

export const TOKEN_LOCALES = new InjectionToken<Locale[]>(
  'available locale list',
)

export const TOKEN_TRANSLATIONS = new InjectionToken<Translations>(
  'multiple custom translations list, frozen, the later the higher privilege',
)

export const TOKEN_REMOTE_TRANSLATIONS = new InjectionToken<Translations>(
  'custom loaded remote translations with highest privilege as `TOKEN_REMOTE_URL`',
)

export const TOKEN_LOOSE = new InjectionToken<boolean>(
  'whether to use loose mode which represents treat `locale-*` as `locale`',
)

export const TOKEN_REMOTE_URL = new InjectionToken<string>(
  'extra remote i18n translations url with highest privilege',
)
