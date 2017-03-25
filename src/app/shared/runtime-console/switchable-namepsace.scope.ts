import { ReplaySubject } from 'rxjs/ReplaySubject';
import { UserService } from 'ngx-login-client';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { NamespaceScope } from 'fabric8-runtime-console/src/app/kubernetes/service/namespace.scope';

@Injectable()
export class SwitchableNamespaceScope extends NamespaceScope {

  private _namespace: Subject<string>;

  constructor(activatedRoute: ActivatedRoute, router: Router, userService: UserService) {
    super(activatedRoute, router);
    this._namespace = new ReplaySubject(1);
  }

  protected getNamespace(params) {
    return 'notinuse';
  }

  changeNamespace(namespace: string) {
    this._namespace.next(namespace);
  }

  get namespace(): Observable<string> {
    return this._namespace.asObservable();
  }

  set namespace(n: Observable<string>) {
    n.subscribe(namespace => console.log('attempt to change namespace to', namespace, 'ignored'));
  }
}
