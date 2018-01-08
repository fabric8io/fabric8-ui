import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CodebasesAddModule } from '../../space/create/codebases/codebases-add/codebases-add.module';
import { AddCodebaseWidgetRoutingModule } from './add-codebase-widget-routing.module';
import { AddCodebaseWidgetComponent } from './add-codebase-widget.component';


@NgModule({
  imports: [CommonModule, FormsModule, AddCodebaseWidgetRoutingModule, CodebasesAddModule],
  declarations: [AddCodebaseWidgetComponent],
  exports: [AddCodebaseWidgetComponent]
})
export class AddCodebaseWidgetModule { }
