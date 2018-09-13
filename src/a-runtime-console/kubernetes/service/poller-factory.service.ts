import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';
import { Poller } from './poller';

@Injectable()
export class PollerFactory {

  constructor(
  ) {}

  newInstance<L>(pollListFactory: () => Observable<L>, dataStream: BehaviorSubject<any>) {
    return new Poller(pollListFactory, dataStream);
  }
}
