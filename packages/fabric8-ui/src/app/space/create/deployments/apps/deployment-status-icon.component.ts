import {
  Component,
  Input
} from '@angular/core';

enum CLASSES {
  ICON_OK = 'pficon-ok',
  ICON_WARN = 'pficon-warning-triangle-o',
  ICON_ERR = 'pficon-error-circle-o'
}

@Component({
  selector: 'deployment-status-icon',
  templateUrl: 'deployment-status-icon.component.html'
})
export class DeploymentStatusIconComponent {
  static readonly CLASSES = CLASSES;

  @Input() iconClass: String;
  @Input() toolTip: String;
}
