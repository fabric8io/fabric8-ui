import { Component, Input, ViewChild } from "@angular/core";
import { BuildConfigs, BuildConfig } from "../../../model/buildconfig.model";
import { BuildConfigDeleteDialog } from "../../buildconfig/delete-dialog/delete-dialog.buildconfig.component";

@Component({
  selector: 'fabric8-pipelines-history',
  templateUrl: './history.pipeline.component.html',
  styleUrls: ['./history.pipeline.component.less']
})
export class PipelinesHistoryComponent {

  @Input() pipeline: BuildConfig;

  @Input() loading: boolean;

  @ViewChild(BuildConfigDeleteDialog) deleteDialog: BuildConfigDeleteDialog;

  openDeleteDialog(deleteBuildConfigModal, pipeline) {
    this.deleteDialog.modal = deleteBuildConfigModal;
    this.deleteDialog.buildconfig = pipeline;
    deleteBuildConfigModal.open();
  }

}
