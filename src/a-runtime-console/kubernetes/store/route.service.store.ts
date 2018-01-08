import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enrichServiceWithRoute, Services } from '../model/service.model';
import { RouteStore } from './route.store';
import { ServiceStore } from './service.store';

@Injectable()
export class RouteServiceStore  {
  public readonly list: Observable<Services>;
  public readonly loading: Observable<boolean>;

  constructor(public serviceStore: ServiceStore, public routeStore: RouteStore) {
    this.loading = this.serviceStore.loading.combineLatest(this.routeStore.loading, (f, s) => f && s);
    this.list = this.serviceStore.list.combineLatest(this.routeStore.list, enrichServiceWithRoute);
  }

  loadAll() {
    this.serviceStore.loadAll();
    this.routeStore.loadAll();
  }
}
