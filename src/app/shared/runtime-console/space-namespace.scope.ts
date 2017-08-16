import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from 'ngx-login-client';

import { DevNamespaceScope } from '../../../a-runtime-console/index';
import { SpaceNamespaceService } from './space-namespace.service';

import { StaticNamespaceScope } from './static-namespace.scope';

/**
 * A NamespaceScope which returns the space-namespace for the space
 */
@Injectable()
export class SpaceNamespaceScope extends StaticNamespaceScope {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    spaceNamespaceService: SpaceNamespaceService
  ) {
    super(
      activatedRoute,
      router,
      spaceNamespaceService.buildNamespace()
    );
  }
}

export let spaceDevNamespaceScopeProvider = {
  provide: DevNamespaceScope,
  useClass: SpaceNamespaceScope
};
