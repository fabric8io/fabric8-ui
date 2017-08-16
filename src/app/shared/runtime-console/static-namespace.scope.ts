import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from 'ngx-login-client';
import { NamespaceScope } from '../../../a-runtime-console/index';

/**
 * A NamespaceScope which always returns a particular namespace
 */
export abstract class StaticNamespaceScope extends NamespaceScope {

  private _namespace: Observable<string>;

  constructor(activatedRoute: ActivatedRoute, router: Router, namespace: Observable<string>) {
    super(activatedRoute, router);
    this._namespace = namespace;
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
