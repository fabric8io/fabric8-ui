import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from 'ngx-login-client';

import { DevNamespaceScope } from 'fabric8-runtime-console';

import { StaticNamespaceScope } from './static-namespace.scope';
import { ObservableFabric8UIConfig } from './../../shared/config/fabric8-ui-config.service';

/**
 * A NamespaceScope which returns the namespace for the space
 */
@Injectable()
export class SpaceNamespaceScope extends StaticNamespaceScope {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    userService: UserService,
    fabric8UIConfig: ObservableFabric8UIConfig
  ) {
    super(
      activatedRoute,
      router,
      Observable.forkJoin(
        userService
          .loggedInUser
          .map(user => user.attributes.username)
          .do(val => console.log(val))
          .first(),
        fabric8UIConfig
          .map(config => config.pipelinesNamespace)
          .do(val => console.log(val))
          .first(),
        (username: string, namespace: string) => ({ username, namespace })
      )
        .do(val => console.log(val))
        .map(val => `${val.username}${val.namespace}`)
        .do(val => console.log(val))
    );
  }
}

export let spaceDevNamespaceScopeProvider = {
  provide: DevNamespaceScope,
  useClass: SpaceNamespaceScope
};
