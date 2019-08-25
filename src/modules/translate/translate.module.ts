import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { ModuleWithProviders, NgModule, Provider } from '@angular/core'

import { DEFAULT_REMOTE_URL, Locale } from './constants'
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
import { TranslateOptions, Translations } from './types'

const EXPORTABLE = [TranslatePipe]

@NgModule({
  imports: [HttpClientModule, CommonModule],
  declarations: EXPORTABLE,
  exports: EXPORTABLE,
})
export class TranslateModule {
  static forRoot({
    locales = Object.values(Locale),
    locale = getLang(locales),
    defaultLocale = getBrowserLang() as Locale,
    translations,
    loose = false,
    remoteTranslations,
    remoteUrl = remoteTranslations ? null : DEFAULT_REMOTE_URL,
  }: TranslateOptions = {}): ModuleWithProviders {
    const providers: Provider[] = [
      {
        provide: TOKEN_LOCALE,
        useValue: locale,
      },
      {
        provide: TOKEN_DEFAULT_LOCALE,
        useValue: defaultLocale,
      },
      {
        provide: TOKEN_LOCALES,
        useValue: locales,
      },
      {
        provide: TOKEN_TRANSLATIONS,
        useValue: Object.freeze({ zh, en }),
        multi: true,
      },
      {
        provide: TOKEN_LOOSE,
        useValue: loose,
      },
    ]
    if (remoteTranslations) {
      providers.push({
        provide: TOKEN_REMOTE_TRANSLATIONS,
        useValue: Object.freeze(remoteTranslations),
        multi: true,
      })
    }
    if (translations) {
      providers.push({
        provide: TOKEN_TRANSLATIONS,
        useValue: Object.freeze(translations),
        multi: true,
      })
    }
    if (remoteUrl) {
      providers.push({
        provide: TOKEN_REMOTE_URL,
        useValue: remoteUrl,
      })
    }
    return {
      ngModule: TranslateModule,
      providers,
    }
  }

  static forChild(translations: Translations): ModuleWithProviders {
    const providers: Provider[] = []
    if (translations) {
      providers.push({
        provide: TOKEN_TRANSLATIONS,
        useValue: Object.freeze(translations),
        multi: true,
      })
    }
    return {
      ngModule: TranslateModule,
      providers,
    }
  }
}
