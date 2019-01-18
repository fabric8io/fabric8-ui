import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PlannerLayoutComponent } from './planner-layout.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PlannerLayoutComponent],
  exports: [PlannerLayoutComponent],
})
export class PlannerLayoutModule {}
