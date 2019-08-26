import { CommonModule } from '@angular/common'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { RxDirectivesModule } from '@rxts/ngrx'
import { number } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/angular'
import { EMPTY, Subject, interval } from 'rxjs'
import { map, pairwise, take } from 'rxjs/operators'

@Component({
  selector: 'rx-async-directive-demo',
  template: `
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
        refetch: refetch$$;
        retryTimes: retryTimes
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

  @Input()
  todoId = 1

  @Input()
  retryTimes = 0

  refetch$$ = new Subject<void>()

  constructor(private readonly http: HttpClient) {}

  fetchTodo(todoId?: number) {
    return typeof todoId === 'number'
      ? this.http.get(`//jsonplaceholder.typicode.com/todos/${todoId}`)
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
    template: /* HTML */ `
      <rx-async-directive-demo
        [todoId]="todoId"
        [retryTimes]="retryTimes"
      ></rx-async-directive-demo>
    `,
    props: {
      todoId: number('todoId', 1),
      retryTimes: number('retryTimes', 0),
    },
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
