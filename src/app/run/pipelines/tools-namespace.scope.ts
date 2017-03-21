import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from 'ngx-login-client';
import { NamespaceScope } from 'fabric8-runtime-console/src/app/kubernetes/service/namespace.scope';

@Injectable()
export class ToolsNamespaceScope extends NamespaceScope {

  private _namespace: Observable<string>;

  constructor(activatedRoute: ActivatedRoute, router: Router, userService: UserService) {
    super(activatedRoute, router);
    this._namespace = userService
      .loggedInUser
      .map(user => `${user.attributes.username}-osio`);
  }

  protected getNamespace(params) {
    return 'notinuse';
  }

  get namespace(): Observable<string> {
    return this._namespace;
  }

  set namespace(ns: Observable<string>) {
    // Intentionally ignored
  }
}
