import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CommonService {
  inshortCardClicked = new Subject < any > ();

  shortCardClicked() {
    this.inshortCardClicked.next(true);
  }
}
