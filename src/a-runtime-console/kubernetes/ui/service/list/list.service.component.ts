import { Component, Input, ViewChild } from "@angular/core";
import { ServiceDeleteDialog } from "../delete-dialog/delete-dialog.service.component";
import { Services } from "../../../model/service.model";

@Component({
  selector: 'fabric8-services-list',
  templateUrl: './list.service.component.html',
  styleUrls: ['./list.service.component.less'],
})
export class ServicesListComponent {

  @Input() services: Services;

  @Input() loading: boolean;

  @Input() prefix: string;

  @Input() hideCheckbox: boolean;

  @ViewChild(ServiceDeleteDialog) deleteDialog: ServiceDeleteDialog;

  openDeleteDialog(deleteServiceModal, service) {
    this.deleteDialog.modal = deleteServiceModal;
    this.deleteDialog.service = service;
    deleteServiceModal.open();
  }

  prefixPath(pathComponent: string) {
    return (this.prefix ? this.prefix + '/' : '') + pathComponent;
  }

}
