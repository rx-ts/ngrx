import { CommonModule } from '@angular/common'
import { RxDirectivesModule } from '@rxts/ngrx'
import { storiesOf } from '@storybook/angular'
import { interval } from 'rxjs'
import { map, pairwise, take } from 'rxjs/operators'

storiesOf('Directives', module).add(
  'Var Directive',
  () => ({
    moduleMetadata: {
      imports: [CommonModule, RxDirectivesModule],
    },
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
