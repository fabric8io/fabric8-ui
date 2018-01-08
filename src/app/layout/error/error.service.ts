import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ErrorService {

  private updateSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  update$: Observable<string> = this.updateSubject.asObservable();

  updateMessage(message: string) {
    this.updateSubject.next(message);
  }
}
