import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { WidgetsModule } from 'ngx-widgets';
import { UserAvatarModule } from './../../widgets/user-avatar/user-avatar.module';
import { AssigneesComponent } from './assignee.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TooltipModule,
    BsDropdownModule,
    UserAvatarModule,
    WidgetsModule,
  ],
  declarations: [AssigneesComponent],
  providers: [TooltipConfig, BsDropdownConfig],
  exports: [AssigneesComponent],
})
export class AssigneesModule {}
