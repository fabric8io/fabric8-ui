import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WorkRoutingModule } from './work-routing.module';
import { WorkComponent } from './work.component';

@NgModule({
  imports: [CommonModule, WorkRoutingModule],
  declarations: [WorkComponent],
})
export class WorkModule {}
