import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { OnLogin } from './../../shared/onlogin.service';
import { PollerFactory } from './poller-factory.service';
import { Watcher } from './watcher';

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
