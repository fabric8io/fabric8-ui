import { WatcherFactory } from './watcher-factory.service';
import { Inject, Injectable } from "@angular/core";
import { Restangular } from "ng2-restangular";
import { KUBERNETES_RESTANGULAR } from "./kubernetes.restangular";
import { NamespaceScope } from "./namespace.scope";
import { Route, Routes } from "../model/route.model";
import { OpenShiftNamespacedResourceService } from "./openshift.namespaced.resource.service";


@Injectable()
export class RouteService extends OpenShiftNamespacedResourceService<Route, Routes> {
  constructor(@Inject(KUBERNETES_RESTANGULAR) kubernetesRestangular: Restangular, namespaceScope: NamespaceScope, watcherFactory: WatcherFactory) {
    super(kubernetesRestangular, namespaceScope, '/routes', watcherFactory);
  }
}
