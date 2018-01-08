import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Poller } from './poller';

@Injectable()
export class PollerFactory {

  constructor(
  ) {}

  newInstance<L>(pollListFactory: () => Observable<L>, dataStream: BehaviorSubject<any>) {
    return new Poller(pollListFactory, dataStream);
  }
}
