import { KubernetesSpecResource } from './kuberentesspecresource.model';
import { Route, Routes } from './route.model';

export class Service extends KubernetesSpecResource {
  exposeUrl: string;

  private _route: Route;

  updateValuesFromResource() {
    super.updateValuesFromResource();
    this.exposeUrl = this.annotations['fabric8.io/exposeUrl'] || '';
  }

  get route(): Route {
    return this._route;
  }

  set route(value: Route) {
    this._route = value;
    if (value) {
      const spec = value.spec || {};
      const host = spec.host;
      if (host) {
        const protcol = spec.tls ? 'https://' : 'http://';
        this.exposeUrl = protcol + host;
      }
    }
  }

  defaultKind() {
    return 'Service';
  }
}

export class Services extends Array<Service> {}

export function enrichServiceWithRoute(services: Services, routes: Routes): Services {
  const map = {};
  if (routes) {
    routes.forEach((s) => (map[s.name] = s));
  }
  if (services) {
    services.forEach((s) => {
      const route = map[s.name];
      if (route) {
        s.route = route;
      }
    });
  }
  return services;
}
