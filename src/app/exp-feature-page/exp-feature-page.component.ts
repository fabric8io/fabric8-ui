import {
  Component,
  OnDestroy
} from '@angular/core';

import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';

import { ExpFeaturePageService } from './exp-feature-page.service';

@Component({
  selector: 'f8-exp-feature-page',
  templateUrl: './exp-feature-page.component.html',
  styleUrls: ['./exp-feature-page.component.less']
})
export class ExpFeaturePageComponent implements OnDestroy {

  message: string = '';
  subscription: Subscription;

  constructor(private expFeaturePageService: ExpFeaturePageService) {
    this.subscription = this.expFeaturePageService.update$.subscribe(
      message => {
        this.message = message;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
