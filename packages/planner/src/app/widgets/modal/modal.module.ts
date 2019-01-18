import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-modal';

import { ModalService } from '../../services/modal.service';
import { ModalComponent } from './modal.component';

@NgModule({
  imports: [CommonModule, RouterModule, ModalModule],
  declarations: [ModalComponent],
  providers: [ModalService],
  exports: [ModalComponent],
})
export class PlannerModalModule {}
