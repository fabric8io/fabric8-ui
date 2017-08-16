import {Component, Input, ViewChild} from "@angular/core";
import {BuildDeleteDialog} from "../delete-dialog/delete-dialog.build.component";
import {Builds} from "../../../model/build.model";

@Component({
  selector: 'fabric8-builds-list',
  templateUrl: './list.build.component.html',
  styleUrls: ['./list.build.component.less'],
})
export class BuildsListComponent {

  @Input() builds: Builds;

  @Input() loading: boolean;

  @Input() hideCheckbox: boolean;

  @ViewChild(BuildDeleteDialog) deleteDialog: BuildDeleteDialog;

  openDeleteDialog(deleteBuildModal, build) {
    this.deleteDialog.modal = deleteBuildModal;
    this.deleteDialog.build = build;
    deleteBuildModal.open();
  }

}
