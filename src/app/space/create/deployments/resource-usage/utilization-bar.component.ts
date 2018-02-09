import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Stat } from '../models/stat';

export enum State {
  Okay = 'utilization-okay',
  Warning = 'utilization-warning'
}

@Component({
  selector: 'utilization-bar',
  templateUrl: 'utilization-bar.component.html',
  styleUrls: ['./utilization-bar.component.less']
})
export class UtilizationBarComponent implements OnDestroy, OnInit {

  @Input() resourceTitle: string;
  @Input() resourceUnit: string;
  @Input() stat: Observable<Stat>;

  private static readonly WARNING_THRESHOLD = 75;

  used: number;
  total: number;
  usedPercent: number;
  unusedPercent: number;

  private currentState: State;
  private statSubscription: Subscription;

  ngOnInit(): void {
    this.currentState = State.Okay;

    this.statSubscription = this.stat.subscribe(val => {
      this.used = val.used;
      this.total = val.quota;
      this.usedPercent = (this.total !== 0) ? Math.floor(this.used / this.total * 100) : 0;
      this.unusedPercent = 100 - this.usedPercent;

      if (this.usedPercent < UtilizationBarComponent.WARNING_THRESHOLD) {
        this.currentState = State.Okay;
      } else {
        this.currentState = State.Warning;
      }
    });
  }

  ngOnDestroy(): void {
    this.statSubscription.unsubscribe();
  }

  getUtilizationClass(): State {
    return this.currentState;
  }

}
