import { TranslateModule } from '@rxts/ngrx'
import markdown from '@rxts/ngrx/utils/decorators.md'
// import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/angular'

import { SharedModule } from '../shared/shared.module'

import { TranslateComponent } from './translate/translate.component'

storiesOf('Modules', module).add(
  'translate',
  () => ({
    moduleMetadata: {
      imports: [
        SharedModule,
        TranslateModule.forRoot({
          translations: {
            zh: {
              toggle_locale: '切换区域',
              nested: {
                params: '证件号: {{ id }}, 姓名: {{ name }}',
              },
            },
            en: {
              nested: {
                params: 'ID: {{ id }}, name: {{ name }}',
              },
            },
          },
          loose: true,
        }),
      ],
      declarations: [TranslateComponent],
      exports: [TranslateComponent],
    },
    template: /* HTML */ `
      <rx-translate></rx-translate>
    `,
  }),
  {
    notes: {
      markdown,
    },
  },
)
