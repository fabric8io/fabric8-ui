import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodebasesServicesModule } from '../services/codebases-services.module';
import { CodebasesItemDetailsComponent } from './codebases-item-details.component';

@NgModule({
  imports: [CodebasesServicesModule, CommonModule, FormsModule],
  declarations: [CodebasesItemDetailsComponent],
  exports: [CodebasesItemDetailsComponent],
})
export class CodebasesItemDetailsModule {}
