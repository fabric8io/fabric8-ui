import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Stat } from '../models/stat';
import { DeploymentStatusService } from '../services/deployment-status.service';

@Component({
  selector: 'utilization-bar',
  templateUrl: 'utilization-bar.component.html',
  styleUrls: ['./utilization-bar.component.less']
})
export class UtilizationBarComponent implements OnDestroy, OnInit {

  @Input() resourceTitle: string;
  @Input() resourceUnit: string;
  @Input() stat: Observable<Stat>;

  warn: boolean = false;

  used: number;
  total: number;
  usedPercent: number;
  unusedPercent: number;

  private statSubscription: Subscription;

  ngOnInit(): void {
    this.statSubscription = this.stat.subscribe((val: Stat): void => {
      this.used = val.used;
      this.total = val.quota;
      this.usedPercent = (this.total !== 0) ? Math.floor(this.used / this.total * 100) : 0;
      this.unusedPercent = 100 - this.usedPercent;

      this.warn = val.used / val.quota >= DeploymentStatusService.WARNING_THRESHOLD;
    });
  }

  ngOnDestroy(): void {
    this.statSubscription.unsubscribe();
  }

}
