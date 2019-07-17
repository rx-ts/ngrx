import { NgModule } from '@angular/core'

import { SharedModule } from '../../shared/shared.module'

import { DecoratorsComponent } from './component'

const EXPORTABLE_COMPONENTS = [DecoratorsComponent]

@NgModule({
  imports: [SharedModule],
  declarations: EXPORTABLE_COMPONENTS,
  exports: EXPORTABLE_COMPONENTS,
})
export class DecoratorsModule {}
