import { Component, Input, ViewEncapsulation } from '@angular/core';

import { Workspace } from '../../codebases/services/workspace';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'workspaces-item-actions',
  templateUrl: './workspaces-item-actions.component.html',
  styleUrls: [ './workspaces-item-actions.component.less' ]
})
export class WorkspacesItemActionsComponent {
  @Input() workspace: Workspace;

  stopWorkspace(): void {
    if (!this.isRunning()) {
      return;
    }

    // todo when API is implemented
  }

  deleteWorkspace(): void {
    // todo when API is implemented
  }

  isRunning(): boolean {
    return this.workspace && this.workspace.attributes === 'RUNNING';
  }

}
