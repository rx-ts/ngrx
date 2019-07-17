import { CommonModule } from '@angular/common'
import { storiesOf } from '@storybook/angular'
import { interval } from 'rxjs'
import { publishReplay, refCount, take } from 'rxjs/operators'

import { RxDirectivesModule } from '../../src/directives/public-api'

storiesOf('Directives', module).add('with text', () => ({
  moduleMetadata: {
    imports: [CommonModule, RxDirectivesModule],
  },
  template: /* HTML */ `
    <ng-container *rxVar="num$ | async; let num">{{ num }}</ng-container>
  `,
  props: {
    num$: interval(1000).pipe(
      take(10),
      publishReplay(1),
      refCount(),
    ),
  },
}))
