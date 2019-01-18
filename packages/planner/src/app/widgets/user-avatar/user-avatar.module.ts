import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { UserAvatarComponent } from './user-avatar.component';

@NgModule({
  imports: [CommonModule, TooltipModule],
  declarations: [UserAvatarComponent],
  providers: [TooltipConfig],
  exports: [UserAvatarComponent],
})
export class UserAvatarModule {}
