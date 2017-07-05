import {
  Component,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';

import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';

import { ErrorService } from './error.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.less']
})
export class ErrorComponent implements OnDestroy {

  message: string = '';
  subscription: Subscription;

  constructor(private errorService: ErrorService) {
    this.subscription = this.errorService.update$.subscribe(
      message => {
        this.message = message;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
