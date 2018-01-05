import { Component, Input, ViewChild } from "@angular/core";
import { ConfigMapDeleteDialog } from "../delete-dialog/delete-dialog.configmap.component";
import { ConfigMaps } from "../../../model/configmap.model";

@Component({
  selector: 'fabric8-configmaps-list',
  templateUrl: './list.configmap.component.html',
  styleUrls: ['./list.configmap.component.less']
})
export class ConfigMapsListComponent {

  @Input() configmaps: ConfigMaps;

  @Input() loading: boolean;

  @Input() prefix: string;

  @Input() hideCheckbox: boolean;

  @ViewChild(ConfigMapDeleteDialog) deleteDialog: ConfigMapDeleteDialog;

  openDeleteDialog(deleteConfigMapModal, configmap) {
    this.deleteDialog.modal = deleteConfigMapModal;
    this.deleteDialog.configmap = configmap;
    deleteConfigMapModal.open();
  }

  prefixPath(pathComponent: string) {
    return (this.prefix ? this.prefix + '/' : '') + pathComponent;
  }

}
