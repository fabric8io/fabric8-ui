import {Component, Input, ViewChild} from "@angular/core";
import {BuildConfigs} from "../../../model/buildconfig.model";
import {BuildConfigDeleteDialog} from "../../buildconfig/delete-dialog/delete-dialog.buildconfig.component";

@Component({
  selector: 'fabric8-pipelines-full-history',
  templateUrl: './full-history.pipeline.component.html',
  styleUrls: ['./full-history.pipeline.component.scss'],
})
export class PipelinesFullHistoryComponent {

  @Input() pipelines: BuildConfigs;

  @Input() loading: boolean;

  @ViewChild(BuildConfigDeleteDialog) deleteDialog: BuildConfigDeleteDialog;

  openDeleteDialog(deleteBuildConfigModal, pipeline) {
    this.deleteDialog.modal = deleteBuildConfigModal;
    this.deleteDialog.buildconfig = pipeline;
    deleteBuildConfigModal.open();
  }

}
