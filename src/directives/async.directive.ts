import { HttpErrorResponse } from '@angular/common/http'
import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  ViewRef,
} from '@angular/core'
import { Observable, Subject, Subscription, combineLatest } from 'rxjs'
import { finalize, retry, startWith, takeUntil } from 'rxjs/operators'

import { Callback, Nullable } from '../types/public-api'
import { ObservableInput } from '../utils/public-api'

export interface IAsyncDirectiveContext<T, E> {
  $implicit: T
  loading: boolean
  error: Nullable<E>
  reload: Callback<never, void>
}

@Directive({
  selector: '[rxAsync]',
})
export class AsyncDirective<T, P, E = HttpErrorResponse>
  implements OnInit, OnDestroy {
  @ObservableInput()
  @Input('rxAsyncContext')
  private context$!: Observable<any>

  @ObservableInput()
  @Input('rxAsyncFetcher')
  private fetcher$!: Observable<Callback<[P], Observable<T>>>

  @ObservableInput()
  @Input('rxAsyncParams')
  private params$!: Observable<P>

  @Input('rxAsyncRefetch')
  private refetch$$ = new Subject<void>()

  @Input('rxAsyncRetryTimes')
  private retryTimes?: number

  private destroy$$ = new Subject<void>()
  private reload$$ = new Subject<void>()

  private context = {
    reload: this.reload.bind(this),
  } as IAsyncDirectiveContext<T, E>

  private viewRef: Nullable<ViewRef>
  private sub: Nullable<Subscription>

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
  ) {}

  reload() {
    this.reload$$.next()
  }

  ngOnInit() {
    combineLatest([
      this.context$,
      this.fetcher$,
      this.params$,
      this.refetch$$.pipe(startWith(null)),
      this.reload$$.pipe(startWith(null)),
    ])
      .pipe(takeUntil(this.destroy$$))
      .subscribe(([context, fetcher, params]) => {
        this.disposeSub()

        Object.assign(this.context, {
          loading: true,
          error: null,
        })

        this.sub = fetcher
          .call(context, params)
          .pipe(
            retry(this.retryTimes),
            finalize(() => {
              this.context.loading = false
              if (this.viewRef) {
                this.viewRef.detectChanges()
              }
            }),
          )
          .subscribe(
            data => (this.context.$implicit = data),
            error => (this.context.error = error),
          )

        if (this.viewRef) {
          return this.viewRef.markForCheck()
        }

        this.viewRef = this.viewContainerRef.createEmbeddedView(
          this.templateRef,
          this.context,
        )
      })
  }

  ngOnDestroy() {
    this.disposeSub()

    this.destroy$$.next()
    this.destroy$$.complete()

    if (this.viewRef) {
      this.viewRef.destroy()
      this.viewRef = null
    }
  }

  disposeSub() {
    if (this.sub) {
      this.sub.unsubscribe()
      this.sub = null
    }
  }
}
