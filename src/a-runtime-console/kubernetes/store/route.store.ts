import { Injectable } from '@angular/core';
import { Route, Routes } from '../model/route.model';
import { NamespaceScope } from '../service/namespace.scope';
import { RouteService } from '../service/route.service';
import { NamespacedResourceStore } from './namespacedresource.store';

@Injectable()
export class RouteStore extends NamespacedResourceStore<Route, Routes, RouteService> {
  constructor(routeService: RouteService, namespaceScope: NamespaceScope) {
    super(routeService, [], <Route> {}, namespaceScope, Route);
  }

  protected get kind() {
    return 'Route';
  }
}
