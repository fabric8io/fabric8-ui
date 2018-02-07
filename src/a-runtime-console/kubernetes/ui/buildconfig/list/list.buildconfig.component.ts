import { Component, Input, ViewChild } from '@angular/core';
import { BuildConfigs } from '../../../model/buildconfig.model';
import { BuildConfigService } from '../../../service/buildconfig.service';
import { BuildConfigDeleteDialog } from '../delete-dialog/delete-dialog.buildconfig.component';

@Component({
  selector: 'fabric8-buildconfigs-list',
  templateUrl: './list.buildconfig.component.html',
  styleUrls: ['./list.buildconfig.component.less']
})
export class BuildConfigsListComponent {

  @Input() buildconfigs: BuildConfigs;

  @Input() loading: boolean;

  @Input() hideCheckbox: boolean;

  @ViewChild(BuildConfigDeleteDialog) deleteDialog: BuildConfigDeleteDialog;

  constructor(private buildConfigService: BuildConfigService) {
  }

  openDeleteDialog(deleteBuildConfigModal, buildconfig) {
    this.deleteDialog.modal = deleteBuildConfigModal;
    this.deleteDialog.buildconfig = buildconfig;
    deleteBuildConfigModal.open();
  }

  startBuild(buildconfig) {
    this.buildConfigService.instantiate(buildconfig);
  }
}
