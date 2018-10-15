import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EmptyStateComponent } from './empty-state.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [ EmptyStateComponent ],
  declarations: [ EmptyStateComponent ]
})
export class EmptyStateModule { }
