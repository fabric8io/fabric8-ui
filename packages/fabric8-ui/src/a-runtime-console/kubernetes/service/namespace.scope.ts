import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';

export interface INamespaceScope {
  namespace: Observable<string>;

  currentNamespace(): string;
}

@Injectable()
export class NamespaceScope implements INamespaceScope {
  public namespace: Observable<string>;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router) {
    this.namespace = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        let r = route;
        while (r.firstChild) {
          r = r.firstChild;
        }
        return r;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.params),
      map((params) => this.getNamespace(params)),
      filter((n) => n),
      distinctUntilChanged(),
    );
  }

  protected getNamespace(params) {
    return params['namespace'] || this.getRouteParams('namespace');
  }

  protected getRouteParams(key): any {
    if (
      this.router &&
      this.router.routerState &&
      this.router.routerState.snapshot &&
      this.router.routerState.snapshot.root
    ) {
      return this.findParamsFor(this.router.routerState.snapshot.root, key);
    }
    return null;
  }

  protected findParamsFor(route, key): any {
    const children = route.children;
    for (const child of children) {
      const params = child.params;
      if (params) {
        let answer = params[key];
        if (!answer) {
          answer = this.findParamsFor(child, key);
        }
        if (answer) {
          return answer;
        }
      }
    }
    return null;
  }

  currentNamespace() {
    return this.findParamsFor(this.router.routerState.snapshot.root, 'namespace');
  }
}
