import { CommonModule } from '@angular/common'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core'
import { RxDirectivesModule } from '@rxts/ngrx'
import { storiesOf } from '@storybook/angular'
import { debounce } from 'lodash'
import { EMPTY, Subject, interval } from 'rxjs'
import { map, pairwise, take } from 'rxjs/operators'

@Component({
  template: `
    <input
      placeholder="Please enter a todo id, 1-200"
      type="number"
      [ngModel]="todoId"
      (ngModelChange)="onTodoIdChange($event)"
    />
    <button (click)="refetch$$.next()">Refetch (Outside rxAsync)</button>
    <div
      *rxAsync="
        let todo;
        let loading = loading;
        let error = error;
        let reload = reload;
        context: context;
        fetcher: fetchTodo;
        params: todoId;
        refetch: refetch$$
      "
    >
      <button (click)="reload()">Reload</button>
      loading: {{ loading }} error: {{ error | json }}
      <br />
      todo: {{ todo | json }}
    </div>
  `,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class AsyncDirectiveComponent {
  context = this

  todoId = 1

  refetch$$ = new Subject<void>()

  onTodoIdChange = debounce(function(
    this: AsyncDirectiveComponent,
    todoId: number,
  ) {
    this.todoId = todoId
    this.cdr.markForCheck()
  },
  500)

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient) {}

  fetchTodo(todoId: string) {
    return typeof todoId === 'number'
      ? this.http.get('http://jsonplaceholder.typicode.com/todos/' + todoId)
      : EMPTY
  }
}

const moduleMetadata = {
  imports: [CommonModule, HttpClientModule, RxDirectivesModule],
  declarations: [AsyncDirectiveComponent],
}

storiesOf('Directives', module)
  .add('Async Directive', () => ({
    moduleMetadata,
    component: AsyncDirectiveComponent,
  }))
  .add(
    'Var Directive',
    () => ({
      moduleMetadata,
      template: /* HTML */ `
        <ng-container
          *rxVar="item$ | async; let item; let prev = prev; let curr = curr"
        >
          item:{{ item | json }}
          <br />
          prev:{{ prev }} curr:{{ curr }}
        </ng-container>
      `,
      props: {
        item$: interval(1000).pipe(
          take(10),
          pairwise(),
          map(([prev, curr]) => ({ prev, curr })),
        ),
      },
    }),
    {
      notes:
        'You can use the implicit variable name, or destructuring assignment',
    },
  )
