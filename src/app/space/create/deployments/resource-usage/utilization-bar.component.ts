import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Stat } from '../models/stat';
import {
  Status,
  StatusType
} from '../services/deployment-status.service';

@Component({
  selector: 'utilization-bar',
  templateUrl: 'utilization-bar.component.html',
  styleUrls: ['./utilization-bar.component.less']
})
export class UtilizationBarComponent implements OnDestroy, OnInit {

  @Input() resourceTitle: string;
  @Input() resourceUnit: string;
  @Input() stat: Observable<Stat>;
  @Input() status: Observable<Status>;

  warn: boolean = false;

  used: number;
  total: number;
  usedPercent: number;
  unusedPercent: number;

  private readonly subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this.stat.subscribe((val: Stat): void => {
        this.used = val.used;
        this.total = val.quota;

        this.usedPercent = (this.total !== 0) ? Math.floor(this.used / this.total * 100) : 0;
        this.unusedPercent = 100 - this.usedPercent;
      })
    );

    this.subscriptions.push(
      this.status.subscribe((status: Status): void => {
        this.warn = status.type != StatusType.OK;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

}
