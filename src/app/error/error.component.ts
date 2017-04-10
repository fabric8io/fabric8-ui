import {
  Component,
  OnDestroy
} from '@angular/core';

import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';

import { ErrorService } from './error.service';

@Component({
  selector: 'f8-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
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
