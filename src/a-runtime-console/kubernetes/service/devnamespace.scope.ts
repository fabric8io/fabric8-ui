import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {NamespaceScope} from "./namespace.scope";

/**
 * Defaults to using the Dev Space rather than the runtime environment
 * for things like BuildConfig or Builds
 */
@Injectable()
export class DevNamespaceScope extends NamespaceScope {
  public namespace: Observable<string>;

  constructor( activatedRoute: ActivatedRoute,  router: Router) {
    super(activatedRoute, router);
  }

  protected getNamespace(params) {
    return params['space'] || this.getRouteParams('space') ||
      params['namespace'] || this.getRouteParams('namespace');
  }


  currentNamespace(): any {
    return this.findParamsFor(this.router.routerState.snapshot.root, "space") || super.currentNamespace();
  }
}
