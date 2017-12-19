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
  templateUrl: 'utilization-bar.component.html',
  styleUrls: ['./utilization-bar.component.less']
})
export class UtilizationBarComponent implements OnDestroy, OnInit {

  @Input() resourceTitle: string;
  @Input() resourceUnit: string;
  @Input() stat: Observable<Stat>;

  used: number;
  total: number;
  usedPercent: number;
  unusedPercent: number;

  currentState: any;

  private statSubscription: Subscription;
  private readonly warningThreshold = 75;

  private states = {
    'Okay' : ['utilization-okay'],
    'Warning' : ['utilization-warning']
  };


  constructor() { }

  ngOnInit(): void {
    this.currentState = this.states.Okay;

    this.statSubscription = this.stat.subscribe(val => {
      this.used = val.used;
      this.total = val.quota;
      this.usedPercent = (this.total !== 0) ? Math.floor(this.used / this.total * 100) : 0;
      this.unusedPercent = 100 - this.usedPercent;

      if (this.usedPercent < this.warningThreshold) {
        this.currentState = this.states.Okay;
      } else {
        this.currentState = this.states.Warning;
      }
    });
  }

  ngOnDestroy(): void {
    this.statSubscription.unsubscribe();
  }

  getUtilizationClasses() {
    return this.currentState;
  }

}
