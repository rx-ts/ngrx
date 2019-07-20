import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { AsyncDirective } from './async.directive'
import { VarDirective } from './var.directive'

const EXPORTABLE_DIRECTIVES = [AsyncDirective, VarDirective]

@NgModule({
  imports: [CommonModule],
  declarations: EXPORTABLE_DIRECTIVES,
  exports: EXPORTABLE_DIRECTIVES,
})
export class RxDirectivesModule {}
