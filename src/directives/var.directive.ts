import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  ViewRef,
} from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { skipWhile, switchMap, takeUntil } from 'rxjs/operators'

import { ObservableInput } from '../utils/public-api'

export type VarDirectiveContext<T> = T & {
  $implicit: T
}

@Directive({
  selector: '[rxVar]',
})
export class VarDirective<T> implements OnInit, OnDestroy {
  @ObservableInput()
  @Input('rxVar')
  private readonly rxVar$!: Observable<T>

  @ObservableInput(false, true)
  @Input('rxVarNullable')
  private readonly rxVarNullable$!: Observable<boolean>

  private readonly destroy$$ = new Subject<void>()
  private readonly context = {} as VarDirectiveContext<T>
  private viewRef?: ViewRef

  constructor(
    private readonly templateRef: TemplateRef<unknown>,
    private readonly viewContainerRef: ViewContainerRef,
  ) {}

  ngOnInit() {
    this.rxVarNullable$
      .pipe(
        takeUntil(this.destroy$$),
        switchMap(nullable =>
          nullable ? this.rxVar$ : this.rxVar$.pipe(skipWhile(_ => _ == null)),
        ),
      )
      .subscribe(variable => {
        this.context.$implicit = variable

        if (variable != null && typeof variable === 'object') {
          Object.assign(this.context, variable)
        }

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
    this.destroy$$.next()
    this.destroy$$.complete()
    if (this.viewRef) {
      this.viewRef.destroy()
    }
  }
}
