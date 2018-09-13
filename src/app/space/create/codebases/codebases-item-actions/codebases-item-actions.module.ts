import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { DialogModule } from 'ngx-widgets';
import { CodebaseDeleteDialogModule } from '../codebases-delete/codebase-delete-dialog.module';
import { CodebasesServicesModule } from '../services/codebases-services.module';
import { CodebasesItemActionsComponent } from './codebases-item-actions.component';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CodebasesServicesModule,
    CodebaseDeleteDialogModule,
    CommonModule,
    DialogModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [ CodebasesItemActionsComponent ],
  exports: [ CodebasesItemActionsComponent ]
})
export class CodebasesItemActionsModule {}
