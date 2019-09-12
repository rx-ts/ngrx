import { CommonModule } from '@angular/common'
import { ModuleWithProviders, NgModule } from '@angular/core'

import { Locale } from './constants'
import { getBrowserLang, getLang } from './helpers'
import { en } from './i18n.core.en'
import { zh } from './i18n.core.zh'
import {
  TOKEN_DEFAULT_LOCALE,
  TOKEN_LOCALE,
  TOKEN_LOCALES,
  TOKEN_LOOSE,
  TOKEN_REMOTE_TRANSLATIONS,
  TOKEN_REMOTE_URL,
  TOKEN_TRANSLATIONS,
} from './tokens'
import { TranslatePipe } from './translate.pipe'
import { TranslateService } from './translate.service'
import { TranslateOptions, Translations } from './types'

const EXPORTABLE = [TranslatePipe]

export const DEFAULT_LOCALES = Object.values(Locale)
export const DEFAULT_LOCALE = getLang(DEFAULT_LOCALES)
export const FALLBACK_LOCALE = getBrowserLang()
export const CORE_TRANSLATIONS = Object.freeze({ zh, en })

@NgModule({
  imports: [CommonModule],
  declarations: EXPORTABLE,
  exports: EXPORTABLE,
})
export class TranslateModule {
  static forRoot(options: TranslateOptions = {}): ModuleWithProviders {
    return {
      ngModule: TranslateModule,
      providers: [
        {
          provide: TOKEN_LOCALES,
          useValue: options.locales || DEFAULT_LOCALES,
        },
        {
          provide: TOKEN_LOCALE,
          useValue: options.locale || DEFAULT_LOCALE,
        },
        {
          provide: TOKEN_DEFAULT_LOCALE,
          useValue: options.defaultLocale || FALLBACK_LOCALE,
        },
        {
          provide: TOKEN_TRANSLATIONS,
          useValue: CORE_TRANSLATIONS,
          multi: true,
        },
        {
          provide: TOKEN_LOOSE,
          useValue: options.loose,
        },
        {
          provide: TOKEN_REMOTE_TRANSLATIONS,
          useValue: options.remoteTranslations,
          multi: true,
        },
        {
          provide: TOKEN_TRANSLATIONS,
          useValue: options.translations,
          multi: true,
        },
        {
          provide: TOKEN_REMOTE_URL,
          useValue: options.remoteUrl,
        },
        TranslateService,
      ],
    }
  }

  static forChild(translations: Translations): ModuleWithProviders {
    return {
      ngModule: TranslateModule,
      providers: [
        {
          provide: TOKEN_TRANSLATIONS,
          useValue: Object.freeze(translations),
          multi: true,
        },
      ],
    }
  }
}
