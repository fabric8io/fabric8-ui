import { OAuthConfigStore } from './../../../store/oauth-config-store';
import { Component, Input, ViewChild } from '@angular/core';
import { PodDeleteDialog } from '../delete-dialog/delete-dialog.pod.component';
import { Pods, Pod } from '../../../model/pod.model';
import { openShiftBrowseResourceUrl } from '../../../model/helpers';

@Component({
  selector: 'fabric8-pods-list',
  templateUrl: './list.pod.component.html',
  styleUrls: ['./list.pod.component.less']
})
export class PodsListComponent {

  @Input() pods: Pods;

  @Input() loading: boolean;

  @Input() prefix: string;

  @Input() hideCheckbox: boolean;

  @ViewChild(PodDeleteDialog) deleteDialog: PodDeleteDialog;

  constructor(
    private oAuthConfigStore: OAuthConfigStore
  ) {}

  openDeleteDialog(deletePodModal, pod) {
    this.deleteDialog.modal = deletePodModal;
    this.deleteDialog.pod = pod;
    deletePodModal.open();
  }

  consoleLogsUrl(pod: Pod): string {
    let consoleUrl = this.consoleUrl(pod);
    return consoleUrl ? consoleUrl + '?tab=logs' : '';
  }

  consoleTerminalUrl(pod: Pod): string {
    let consoleUrl = this.consoleUrl(pod);
    return consoleUrl ? consoleUrl + '?tab=terminal' : '';
  }

  consoleUrl(pod: Pod): string {
    return openShiftBrowseResourceUrl(pod, this.oAuthConfigStore.config);
  }

  prefixPath(pathComponent: string) {
    return (this.prefix ? this.prefix + '/' : '') + pathComponent;
  }
}
