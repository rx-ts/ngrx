import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

const EXPORTABLE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule]

@NgModule({
  imports: EXPORTABLE_MODULES,
  exports: EXPORTABLE_MODULES,
})
export class SharedModule {}
