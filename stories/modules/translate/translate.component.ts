import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TranslateService } from '@rxts/ngrx'

@Component({
  selector: 'rx-translate',
  template: `
    {{ 'language' | translate }}
    {{ 'nested.params' | translate: { id: 123, name: 'Peter' } }}
    <br />
    <button (click)="toggleLocale()">
      {{ 'toggle_locale' | translate }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslateComponent {
  constructor(private readonly translate: TranslateService) {}

  toggleLocale() {
    this.translate.toggleLocale()
  }
}
