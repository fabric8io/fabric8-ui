import {
  Component, Input,
  OnDestroy,
  OnInit, ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs';
import 'rxjs/operators/map';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-feature-footer',
  templateUrl: './feature-footer.component.html',
  styleUrls: ['./feature-footer.component.less']
})
export class FeatureFooterComponent implements OnInit, OnDestroy {

  private userSubscription: Subscription;
  private feature = {number: 2, level: 'internal'};

  constructor() {

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
