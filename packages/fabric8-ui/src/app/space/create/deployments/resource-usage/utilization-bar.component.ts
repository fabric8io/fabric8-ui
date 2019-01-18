import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ResourceUtilization } from '../models/resource-utilization';
import { Status, StatusType } from '../services/deployment-status.service';

@Component({
  selector: 'utilization-bar',
  templateUrl: 'utilization-bar.component.html',
  styleUrls: ['./utilization-bar.component.less'],
})
export class UtilizationBarComponent implements OnDestroy, OnInit {
  @Input() resourceTitle: string;
  @Input() resourceUnit: string;
  @Input() stat: Observable<ResourceUtilization>;
  @Input() status: Observable<Status>;

  warn: boolean = false;

  used: number;
  otherSpacesUsed: number;

  total: number;

  usedPercent: number;
  othersPercent: number;
  unusedPercent: number;

  private readonly subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this.stat.subscribe(
        (val: ResourceUtilization): void => {
          this.used = val.currentSpaceUsage.used;
          this.otherSpacesUsed = val.otherSpacesUsage.used;
          this.total = val.currentSpaceUsage.quota;

          this.usedPercent = this.total !== 0 ? Math.floor((this.used / this.total) * 100) : 0;
          this.othersPercent =
            this.total !== 0 ? Math.floor((this.otherSpacesUsed / this.total) * 100) : 0;
          this.unusedPercent = 100 - (this.usedPercent + this.othersPercent);
        },
      ),
    );

    this.subscriptions.push(
      this.status.subscribe(
        (status: Status): void => {
          this.warn = status.type != StatusType.OK;
        },
      ),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }
}
