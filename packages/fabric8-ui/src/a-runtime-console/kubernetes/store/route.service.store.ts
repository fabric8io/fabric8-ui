import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/operators';
import { enrichServiceWithRoute, Services } from '../model/service.model';
import { RouteStore } from './route.store';
import { ServiceStore } from './service.store';

@Injectable()
export class RouteServiceStore  {
  public readonly list: Observable<Services>;
  public readonly loading: Observable<boolean>;

  constructor(public serviceStore: ServiceStore, public routeStore: RouteStore) {
    this.loading = this.serviceStore.loading.pipe(combineLatest(this.routeStore.loading, (f, s) => f && s));
    this.list = this.serviceStore.list.pipe(combineLatest(this.routeStore.list, enrichServiceWithRoute));
  }

  loadAll() {
    this.serviceStore.loadAll();
    this.routeStore.loadAll();
  }
}
