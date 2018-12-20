import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class ErrorService {
  private updateSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private routeSubject: Subject<string> = new Subject<string>();

  readonly update$: Observable<string> = this.updateSubject.asObservable();
  readonly failedRoute$: Observable<string> = this.routeSubject.asObservable();

  updateMessage(message: string) {
    this.updateSubject.next(message);
  }

  updateFailedRoute(route: string) {
    this.routeSubject.next(route);
  }
}
