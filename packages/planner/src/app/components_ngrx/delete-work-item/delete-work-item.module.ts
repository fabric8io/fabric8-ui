import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { FeatureFlagModule } from 'ngx-feature-flag';
import { ModalService } from '../../services/modal.service';
import { DeleteWorkItemComponent } from './delete-work-item.component';

@NgModule({
  imports: [CommonModule, TooltipModule, FeatureFlagModule],
  declarations: [DeleteWorkItemComponent],
  exports: [DeleteWorkItemComponent],
  providers: [ModalService, TooltipConfig],
})
export class DeleteWorkItemModule {}
