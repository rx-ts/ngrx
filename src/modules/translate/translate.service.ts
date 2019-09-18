/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Inject, Injectable, OnDestroy, isDevMode } from '@angular/core'
import { get, head, isPlainObject, template } from 'lodash'
import { EMPTY, Observable, Subject, forkJoin, throwError } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { catchError, filter, finalize, map, takeUntil } from 'rxjs/operators'

import { Nullable } from '../../types/public-api'
import {
  ObservableInput,
  TEMPLATE_OPTIONS,
  TOKEN_BASE_HREF,
  isAbsoluteUrl,
} from '../../utils/public-api'

import { LOCALE_PLACEHOLDER_REGEX, LOCALE_STORAGE, Locale } from './constants'
import {
  TOKEN_DEFAULT_LOCALE,
  TOKEN_LOCALE,
  TOKEN_LOCALES,
  TOKEN_LOOSE,
  TOKEN_REMOTE_TRANSLATIONS,
  TOKEN_REMOTE_URL,
  TOKEN_TRANSLATIONS,
} from './tokens'
import { TranslateKey, Translation, Translations } from './types'

@Injectable()
export class TranslateService implements OnDestroy {
  get remoteLoaded() {
    return this._remoteLoaded
  }

  @ObservableInput(true)
  readonly locale$!: Observable<Locale>

  @ObservableInput(true)
  readonly defaultLocale$!: Observable<Locale>

  @ObservableInput('_remoteLoaded')
  readonly remoteLoaded$!: Observable<boolean | undefined>

  private _remoteLoaded?: boolean

  private readonly destroy$$ = new Subject<void>()

  constructor(
    @Inject(TOKEN_LOCALES)
    private readonly locales: Locale[],
    @Inject(TOKEN_LOCALE)
    public locale: Locale,
    @Inject(TOKEN_DEFAULT_LOCALE)
    public defaultLocale: Locale,
    @Inject(TOKEN_TRANSLATIONS)
    private readonly translationsList: Nullable<Array<Readonly<Translations>>>,
    @Inject(TOKEN_LOOSE)
    private readonly loose: boolean,
    @Inject(TOKEN_BASE_HREF)
    private readonly baseHref: string,
    @Inject(TOKEN_REMOTE_TRANSLATIONS)
    private remoteTranslationsList: Nullable<Array<Readonly<Translations>>>,
    @Inject(TOKEN_REMOTE_URL)
    private readonly remoteUrl?: string,
  ) {
    this._watchLocale()
    this._fetchTranslations()
  }

  ngOnDestroy() {
    this.destroy$$.next()
    this.destroy$$.complete()
  }

  /**
   * 根据翻译 @param key 和上下文数据 @param data 获取翻译内容，翻译项不存在直接返回 key 文本
   * @param ignoreNonExist 开发环境是否忽视不存在的翻译项
   */
  get(key: TranslateKey, data?: unknown, ignoreNonExist = false) {
    const translation = this._get(
      typeof key === 'string' ? key : this._getValue(key),
      typeof key !== 'string' || ignoreNonExist,
    )
    if (data != null && typeof data !== 'object') {
      data = [data]
    }
    return template(translation, TEMPLATE_OPTIONS)(data as object)
  }

  /**
   * 根据 `locales` 循环切换当前区域设置
   */
  toggleLocale() {
    const index = this.locales.indexOf(this.locale)
    if (index === -1) {
      if (isDevMode()) {
        throw new TypeError('`locales` has not been initialized correctly')
      }
      return
    }
    const nextLocale = this.locales[
      index === this.locales.length - 1 ? 0 : index + 1
    ]

    if (!nextLocale || this.locale === nextLocale) {
      return
    }

    this.locale = nextLocale
  }

  /**
   * 从远程 url 模板和区域获取翻译包
   */
  fetchTranslation(remoteUrl: string): Observable<Translations>
  fetchTranslation(remoteUrl: string, locale: string): Observable<Translation>
  fetchTranslation(remoteUrl: string, locale?: string) {
    if (isDevMode() && LOCALE_PLACEHOLDER_REGEX.exec(remoteUrl) && !locale) {
      throw new TypeError(
        '`locale` is required sine the provided remote url contains locale placeholder',
      )
    }
    return ajax.getJSON(
      locale ? remoteUrl.replace(LOCALE_PLACEHOLDER_REGEX, locale) : remoteUrl,
    )
  }

  private _watchLocale() {
    this.locale$
      .pipe(takeUntil(this.destroy$$))
      .subscribe(locale => localStorage.setItem(LOCALE_STORAGE, locale))
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private _fetchTranslations() {
    const { baseHref } = this
    let { remoteUrl } = this

    if (!remoteUrl) {
      return
    }

    this._remoteLoaded = false
    remoteUrl = head(remoteUrl.split(/#/))
    const isAbsolute = isAbsoluteUrl(remoteUrl)
    if (isDevMode()) {
      let errorMessage
      if (!isAbsolute && (!baseHref || !isAbsoluteUrl(baseHref))) {
        errorMessage = 'absolute base href is required for relative remote url'
      } else if (remoteUrl.split('?')[0].includes('./')) {
        errorMessage =
          'do not use any dot with slash for relative url which should always base from base href'
      }
      if (errorMessage) {
        throw new TypeError(errorMessage)
      }
    }

    if (!isAbsolute) {
      remoteUrl =
        (baseHref.endsWith('/') ? baseHref : baseHref + '/') + remoteUrl
    }

    ;(LOCALE_PLACEHOLDER_REGEX.exec(remoteUrl)
      ? forkJoin(
          this.locales.map(locale =>
            this.fetchTranslation(remoteUrl, locale).pipe(
              catchError(error => {
                if (this.loose) {
                  const looseLocale = this._getLooseLocale(locale)
                  if (
                    locale !== looseLocale &&
                    !this.locales.includes(looseLocale)
                  ) {
                    return this.fetchTranslation(remoteUrl, looseLocale)
                  }
                }
                return isDevMode() ? throwError(error) : EMPTY
              }),
              filter<Translation>(isPlainObject),
              map<Translation, Partial<Record<Locale, Translation>>>(
                translation => ({
                  [locale]: translation,
                }),
              ),
            ),
          ),
          // eslint-disable-next-line @typescript-eslint/unbound-method
        ).pipe(map(_ => _.reduce(Object.assign)))
      : this.fetchTranslation(remoteUrl).pipe(
          catchError(error => (isDevMode() ? throwError(error) : EMPTY)),
        )
    )
      .pipe(
        takeUntil(this.destroy$$),
        finalize(() => (this._remoteLoaded = true)),
      )
      .subscribe(remoteTranslations => {
        if (!remoteTranslations) {
          return
        }
        if (!this.remoteTranslationsList) {
          this.remoteTranslationsList = []
        }
        this.remoteTranslationsList.push(Object.freeze(remoteTranslations))
      })
  }

  private _getLooseLocale(locale: string) {
    return head(locale.split(/[-_]/)) as Locale
  }

  private _getValue<T>(
    source: Nullable<Partial<Record<Locale, T>>>,
    locale = this.locale,
  ): Nullable<T> {
    if (!source) {
      return
    }
    let value = source[locale]
    if (value == null && this.loose) {
      const looseLocale = this._getLooseLocale(locale)
      if (locale !== looseLocale) {
        value = source[looseLocale]
      }
    }
    if (value == null && locale !== this.defaultLocale) {
      return this._getValue(source, this.defaultLocale)
    }
    return value
  }

  private _getWithFallback(
    key: string,
    locale = this.locale,
    translations: Translations,
  ): Nullable<string> {
    const value = get(this._getValue(translations, locale), key)
    if (value != null) {
      if (typeof value === 'object' && isDevMode()) {
        console.warn(
          `The translation for locale: \`${locale}\` and key:\`${key}\` is an object, which could be unexpected`,
        )
      }
      return value.toString()
    }
    if (locale !== this.defaultLocale) {
      return this._getWithFallback(key, this.defaultLocale, translations)
    }
  }

  private _getBase(
    key: string,
    locale = this.locale,
    translationsList: Nullable<Translations[]>,
  ) {
    if (!translationsList || translationsList.length === 0) {
      return
    }
    for (let i = translationsList.length; i > 0; i--) {
      const value = this._getWithFallback(key, locale, translationsList[i - 1])
      if (value != null) {
        return value
      }
    }
  }

  private _get(key: string, ignoreNonExist = false, locale = this.locale) {
    let value = this._getBase(key, locale, this.remoteTranslationsList)
    if (value == null) {
      value = this._getBase(key, locale, this.translationsList)
    }
    if (value != null) {
      return value
    }
    if (isDevMode() && !ignoreNonExist) {
      console.warn(
        `No translation found for locale: \`${locale}\` and key:\`${key}\`, which could be unexpected`,
      )
    }
    return key
  }
}
