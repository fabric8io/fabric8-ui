import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Stat } from '../models/stat';

import {
  Observable,
  Subscription
} from 'rxjs';

@Component({
  selector: 'utilization-bar',
  templateUrl: 'utilization-bar.component.html'
})
export class UtilizationBarComponent implements OnDestroy, OnInit {

  @Input() resourceTitle: string;
  @Input() resourceUnit: string;
  @Input() stat: Observable<Stat>;

  used: number;
  total: number;
  usedPercent: number;
  unusedPercent: number;
  color: string;

  private colors = {
    'Okay': '#39a5dc', // Light blue
    'Warning': '#f39d3c' // Orange
  };

  private statSubscription: Subscription;
  private readonly warningThreshold = 75;

  constructor() { }

  ngOnInit(): void {
    this.color = this.colors.Okay;

    this.statSubscription = this.stat.subscribe(val => {
      this.used = val.used;
      this.total = val.quota;
      this.usedPercent = (this.total !== 0) ? Math.floor(this.used / this.total * 100) : 0;
      this.unusedPercent = 100 - this.usedPercent;

      if (this.usedPercent < this.warningThreshold) {
        this.color = this.colors.Okay;
      } else {
        this.color = this.colors.Warning;
      }
    });
  }

  ngOnDestroy(): void {
    this.statSubscription.unsubscribe();
  }

}
