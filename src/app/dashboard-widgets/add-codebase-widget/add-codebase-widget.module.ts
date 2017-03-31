import { AddCodebaseWidgetRoutingModule } from './add-codebase-widget-routing.module';
import { CodebasesAddModule } from './../../create/codebases/codebases-add/codebases-add.module';
import { AddCodebaseWidgetComponent } from './add-codebase-widget.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [CommonModule, FormsModule, AddCodebaseWidgetRoutingModule, CodebasesAddModule],
  declarations: [AddCodebaseWidgetComponent],
  exports: [AddCodebaseWidgetComponent]
})
export class AddCodebaseWidgetModule { }
