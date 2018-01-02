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

const ICON_OK = 'pficon-ok';
const ICON_WARN = 'pficon-warning-triangle-o';
const ICON_ERR = 'pficon-error-circle-o';
const MSG_OK = 'Everything is ok.';
const STAT_THRESHOLD = .6;
@Component({
  selector: 'deployment-status-icon',
  templateUrl: 'deployment-status-icon.component.html',
  styleUrls: ['./deployment-status-icon.component.less']
})
export class DeploymentStatusIconComponent implements OnDestroy, OnInit {
  @Input() cpuDataStream: Observable<CpuStat>;

  icon: String;
  toolTip: String;
  subscriptions: Array<Subscription> = [];

  constructor() {
    this.icon = ICON_OK;
    this.toolTip = MSG_OK;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.cpuDataStream.subscribe((stat) => {
      this.changeStatus(stat);
    }));
  }

  changeStatus(stat: CpuStat) {
    this.icon = ICON_OK;
    this.toolTip = MSG_OK;
    if (stat.used / stat.quota > STAT_THRESHOLD) {
      this.iconClass = ICON_WARN;
      this.toolTip = 'CPU usage is approaching or at capacity.';
    }

    if (stat.used > stat.quota) {
      this.iconClass = ICON_ERR;
      this.toolTip = 'CPU usage has exceeded capacity.';
    }
  }
}
