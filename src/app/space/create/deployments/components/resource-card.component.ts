import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { DeploymentsService } from '../services/deployments.service';
import { Environment } from '../models/environment';
import { Stat } from '../models/stat';

import {
  Observable,
  Subscription
} from 'rxjs';

@Component({
  selector: 'resource-card',
  templateUrl: 'resource-card.component.html'
})
export class ResourceCardComponent implements OnInit {

  @Input() resourceTitle: string;
  @Input() stat: Observable<Stat>;

  used: number;
  total: number;
  usedPercent: number;
  unusedPercent: number;

  private statSubscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.statSubscription = this.stat.subscribe(val => {
      this.used = val.used;
      this.total = val.total;
      this.usedPercent = (this.total !== 0) ? Math.floor(this.used / this.total * 100) : 0;
      this.unusedPercent = 100 - this.usedPercent;
    });
  }

  ngOnDestroy(): void {
    this.statSubscription.unsubscribe();
  }

}
