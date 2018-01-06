import { Injectable } from '@angular/core';

import { OnLogin } from './../../shared/onlogin.service';
import { Watcher } from './watcher';
import { Observable } from 'rxjs/Observable';
import { PollerFactory } from './poller-factory.service';

@Injectable()
export class WatcherFactory {

  constructor(
    private onLogin: OnLogin,
    private pollerFactory: PollerFactory
  ) {}

  newInstance<L>(pathFn: () => String, queryParams: any, listFactory: () => Observable<L>) {
    return new Watcher(pathFn, queryParams, this.onLogin, listFactory, this.pollerFactory);
  }
}
