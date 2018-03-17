import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  host: {
    class: 'create-dialog'
  },
  encapsulation: ViewEncapsulation.None,
  selector: 'delete-deployment-modal',
  templateUrl: './delete-deployment-modal.component.html'
})
export class DeleteDeploymentModal {

  @Input() host: ModalDirective;
  @Input() applicationId: string = '';
  @Input() environmentName: string = '';
  @Output() deleteEvent = new EventEmitter();

  constructor() {}

  public openModal(): void {
    this.host.show();
  }

  public closeModal(): void {
    this.host.hide();
  }

  public confirmDeletion() {
    this.deleteEvent.emit();
    this.host.hide();
  }
}
