import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ExpFeaturePageService {

  private updateSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  update$: Observable<string> = this.updateSubject.asObservable();

  updateMessage(message: string) {
    this.updateSubject.next(message);
  }
}