import {Component, Input, ViewChild} from "@angular/core";
import {BuildConfigs} from "../../../model/buildconfig.model";
import {BuildConfigDeleteDialog} from "../../buildconfig/delete-dialog/delete-dialog.buildconfig.component";
import {BuildConfigService} from "../../../service/buildconfig.service";

@Component({
  selector: 'fabric8-pipelines-list',
  templateUrl: './list.pipeline.component.html',
  styleUrls: ['./list.pipeline.component.less'],
})
export class PipelinesListComponent {

  @Input() pipelines: BuildConfigs;

  @Input() loading: boolean;

  @ViewChild(BuildConfigDeleteDialog) deleteDialog: BuildConfigDeleteDialog;

  constructor(private buildConfigService: BuildConfigService) {
  }

  openDeleteDialog(deleteBuildConfigModal, pipeline) {
    this.deleteDialog.modal = deleteBuildConfigModal;
    this.deleteDialog.buildconfig = pipeline;
    deleteBuildConfigModal.open();
  }

  startBuild(pipeline) {
    this.buildConfigService.instantiate(pipeline);
  }

}
