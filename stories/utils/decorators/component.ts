import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { ObservableInput, ValueHook } from '@rxts/ngrx'
import {
  Observable,
  ObservableInput as RxObservableInput,
  concat,
  merge,
} from 'rxjs'
import { switchMap } from 'rxjs/operators'

export enum Strategy {
  Merge = 'merge',
  Concat = 'concat',
}

type Handler = <T, T2>(
  v1: RxObservableInput<T>,
  v2: RxObservableInput<T2>,
) => Observable<T | T2>

export const STRATEGY_OPERATORS: Record<Strategy, Handler> = {
  // tslint:disable-next-line: deprecation
  [Strategy.Merge]: merge,
  // tslint:disable-next-line: deprecation
  [Strategy.Concat]: concat,
}

@Component({
  selector: 'rx-decorator',
  templateUrl: 'template.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecoratorsComponent {
  @ObservableInput()
  @Input('evens')
  evens$!: Observable<number>

  @ObservableInput()
  @Input('odds')
  odds$!: Observable<number>

  @ObservableInput()
  @Input('strategy')
  strategy$!: Observable<Strategy>

  merged$ = this.strategy$.pipe(
    switchMap(strategy =>
      STRATEGY_OPERATORS[strategy](this.evens$, this.odds$),
    ),
  )

  @ValueHook(function() {
    this.hookSet++
  })
  @Input()
  hook?: string

  hookSet = 0
}
