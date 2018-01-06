import { Injectable } from '@angular/core';
import { NamespacedResourceStore } from './namespacedresource.store';
import { NamespaceScope } from '../service/namespace.scope';
import { RouteService } from '../service/route.service';
import { Route, Routes } from '../model/route.model';

@Injectable()
export class RouteStore extends NamespacedResourceStore<Route, Routes, RouteService> {
  constructor(routeService: RouteService, namespaceScope: NamespaceScope) {
    super(routeService, [], <Route> {}, namespaceScope, Route);
  }

  protected get kind() {
    return 'Route';
  }
}
