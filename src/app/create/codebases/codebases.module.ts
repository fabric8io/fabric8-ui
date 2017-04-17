import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'ng2-bootstrap';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { ListViewModule } from 'ngx-widgets';

import { CodebasesAddModule } from './codebases-add/codebases-add.module';
import { CodebasesComponent } from './codebases.component';
import { CodebasesItemModule } from './codebases-item/codebases-item.module';
import { CodebasesItemActionsModule } from './codebases-item-actions/codebases-item-actions.module';
import { CodebasesItemDetailsModule } from './codebases-item-details/codebases-item-details.module';
import { CodebasesToolbarModule } from './codebases-toolbar/codebases-toolbar.module';
import { CodebasesRoutingModule } from './codebases-routing.module';

@NgModule({
  imports: [
    CodebasesAddModule,
    CodebasesItemModule,
    CodebasesItemActionsModule,
    CodebasesItemDetailsModule,
    CodebasesToolbarModule,
    CodebasesRoutingModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    ListViewModule
  ],
  declarations: [CodebasesComponent],
  exports: [CodebasesComponent]
})
export class CodebasesModule {
  constructor(http: Http) { }
}
