import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from 'ngx-login-client';

import { DevNamespaceScope } from 'fabric8-runtime-console';

import { StaticNamespaceScope } from './static-namespace.scope';
import { ObservableFabric8UIConfig } from './../../shared/config/fabric8-ui-config.service';
import { Fabric8UIConfig } from './../../shared/config/fabric8-ui-config';

// TODO HACK These should all be exported by the modules


/**
 * A NamespaceScope which always returns a particular namespace
 */
@Injectable()
export class ToolsNamespaceScope extends StaticNamespaceScope {

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
          .first(),
        fabric8UIConfig
          .map(config => config.pipelinesNamespace)
          .first(),
        (username: string, namespace: string) => ({ username, namespace })
      )
        .map(val => `${val.username}${val.namespace}`)
    );
  }
}

export let toolsNamespaceScopeProvider = {
  provide: DevNamespaceScope,
  useClass: ToolsNamespaceScope
};
