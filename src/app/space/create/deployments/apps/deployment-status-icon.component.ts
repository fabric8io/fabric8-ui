import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Observable,
  Subscription
} from 'rxjs';

import { CpuStat } from '../models/cpu-stat';

enum CLASSES {
  ICON_OK = 'pficon-ok',
  ICON_WARN = 'pficon-warning-triangle-o',
  ICON_ERR = 'pficon-error-circle-o'
}

const STAT_THRESHOLD = .6;

@Component({
  selector: 'deployment-status-icon',
  templateUrl: 'deployment-status-icon.component.html'
})
export class DeploymentStatusIconComponent {
  static readonly CLASSES = CLASSES;

  @Input() iconClass: String;
  @Input() toolTip: String;
}
