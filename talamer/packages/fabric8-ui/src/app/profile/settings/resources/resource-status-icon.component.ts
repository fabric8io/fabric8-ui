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
  selector: 'resource-status-icon',
  templateUrl: 'resource-status-icon.component.html'
})
export class ResourceStatusIcon {
  static readonly CLASSES = CLASSES;

  @Input() iconClass: String;
}
