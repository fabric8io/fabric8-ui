import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { findParameter } from '../model/helpers';
import { SpaceNamespace } from '../model/space-namespace';

@Injectable()
export class SpaceNamespaceService implements SpaceNamespace {

  private _namespaceSpaceSubject = new BehaviorSubject('');
  private _labelSpaceSubject = new BehaviorSubject('');

  get namespaceSpace(): Observable<string> {
    return this._namespaceSpaceSubject.asObservable();
  }

  get labelSpace(): Observable<string> {
      return this._labelSpaceSubject.asObservable();
    }

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.events
      // lets an additional event in case we miss events when reloading a page
      .startWith(null)
      .map(() => getParameter(this.route, this.router, 'entity'))
      .skipWhile(val => !val)
      .distinctUntilChanged()
      .subscribe(this._namespaceSpaceSubject);
    this.router.events
      // lets an additional event in case we miss events when reloading a page
      .startWith(null)
      .map(() => getParameter(this.route, this.router, 'space'))
      .skipWhile(val => !val)
      .distinctUntilChanged()
      .subscribe(this._labelSpaceSubject);
  }
}

function getParameter(route: ActivatedRoute, router: Router, name: string) {
  return findParameter(route, name) || findRouteParameter(router, name);
}

function findRouteParameter(router: Router, name: string) {
  let params = findRouteParameters(router);
  if (params) {
    return params[name];
  }
  return null;
}

function findRouteParameters(router: Router) {
  if (
    router &&
    router.routerState &&
    router.routerState.snapshot &&
    router.routerState.snapshot.root
  ) {
    let firstChild = router.routerState.snapshot.root.firstChild;
    let res = {};
    while (firstChild) {
      res = merge(res, firstChild.params);
      firstChild = firstChild.firstChild;
    }
    return res;
  }
  return null;
}
