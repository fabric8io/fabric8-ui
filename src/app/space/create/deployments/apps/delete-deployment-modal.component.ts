import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  host: {
    class: 'create-dialog'
  },
  encapsulation: ViewEncapsulation.None,
  selector: 'delete-deployment-modal',
  templateUrl: './delete-deployment-modal.component.html',
  styleUrls: ['./delete-deployment-modal.component.less']
})
export class DeleteDeploymentModal {

  @Input() applicationId: string;
  @Input() environmentName: string;
  @Output() deleteEvent: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('modal') host: ModalDirective;

  openModal(): void {
    this.host.show();
  }

  closeModal(): void {
    this.host.hide();
  }

  confirmDeletion(): void {
    this.deleteEvent.emit();
    this.host.hide();
  }
}
