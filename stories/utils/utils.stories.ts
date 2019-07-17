import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/angular'
import { interval, partition } from 'rxjs'
import { shareReplay, take } from 'rxjs/operators'

import { Strategy } from './decorators/component'
import { DecoratorsModule } from './decorators/module'
import markdown from './decorators/README.md'

const [evens$, odds$] = partition(
  interval(1000).pipe(take(20)),
  i => i % 2 === 0,
)

storiesOf('Utilities', module).add(
  'Decorators',
  () => ({
    moduleMetadata: {
      imports: [DecoratorsModule],
    },
    template: /* HTML */ `
      <rx-decorator
        [evens]="evens$ | async"
        [odds]="odds$ | async"
        [strategy]="strategy"
        [hook]="hook"
      ></rx-decorator>
    `,
    props: {
      evens$: evens$.pipe(shareReplay()),
      odds$: odds$.pipe(shareReplay()),
      strategy: select(
        'strategy',
        [Strategy.Merge, Strategy.Concat],
        Strategy.Merge,
      ),
      hook: text('hook', 'Try to type, setter hook will be called'),
    },
  }),
  {
    notes: {
      markdown,
    },
  },
)
