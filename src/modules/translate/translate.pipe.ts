import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core'
import { isEqual } from 'lodash'
import { Subject, Subscription, merge } from 'rxjs'
import { filter, first, takeUntil } from 'rxjs/operators'

import { Nullable } from '../../types/public-api'

import { TranslateService } from './translate.service'
import { TranslateKey } from './types'

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private value!: string
  private lastKey?: Nullable<TranslateKey>
  private lastData?: unknown
  private lastRemoteLoaded? = this.translate.remoteLoaded
  private onChange?: Nullable<Subscription>

  private readonly destroy$$ = new Subject<void>()

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly translate: TranslateService,
  ) {
    this.translate.remoteLoaded$
      .pipe(
        filter(_ => !!_),
        first(),
        takeUntil(this.destroy$$),
      )
      .subscribe(() => this.cdr.markForCheck())
  }

  transform(key: TranslateKey, data?: unknown, ignoreNonExist?: boolean) {
    const { remoteLoaded } = this.translate
    const isLoading = remoteLoaded === false
    if (
      isEqual(key, this.lastKey) &&
      isEqual(data, this.lastData) &&
      (isEqual(remoteLoaded, this.lastRemoteLoaded) || !remoteLoaded)
    ) {
      return this.value
    }

    this.lastData = data
    this.lastRemoteLoaded = remoteLoaded
    this.updateValue(key, data, ignoreNonExist, isLoading)
    this.dispose()

    this.onChange = merge(this.translate.locale$, this.translate.defaultLocale$)
      .pipe(takeUntil(this.destroy$$))
      .subscribe(() => {
        if (this.lastKey) {
          this.lastKey = null
          this.updateValue(key, data, ignoreNonExist, isLoading)
        }
      })

    return this.value
  }

  ngOnDestroy() {
    this.destroy$$.next()
    this.destroy$$.complete()
  }

  private updateValue(
    key: TranslateKey,
    data?: unknown,
    ignoreNonExist?: boolean,
    isLoading?: boolean,
  ) {
    const value = this.translate.get(key, data, ignoreNonExist || isLoading)
    // avoid text slashing on remote loading
    if (!isLoading || key !== value) {
      this.value = value
      this.lastKey = key
      this.cdr.markForCheck()
    }
  }

  private dispose() {
    if (this.onChange) {
      this.onChange.unsubscribe()
      this.onChange = null
    }
  }
}
