import { Injectable } from '@angular/core';

import { Spaces } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Rx';

import { SpaceNamespace } from '../../../a-runtime-console/index';
import { Fabric8RuntimeConsoleService } from './fabric8-runtime-console.service';
import { SpaceNamespaceService } from './space-namespace.service';

@Injectable()
export class Fabric8UISpaceNamespace implements SpaceNamespace {

  constructor(
    private spaces: Spaces,
    private spaceNamespaceService: SpaceNamespaceService,
    private fabric8RuntimeConsoleService: Fabric8RuntimeConsoleService
  ) { }

  get namespaceSpace(): Observable<string> {
    return this.fabric8RuntimeConsoleService
      .loading()
      .switchMap(() => this.spaceNamespaceService.buildNamespace());
  }

  get labelSpace(): Observable<string> {
    return this.fabric8RuntimeConsoleService
      .loading()
      .switchMap(() => this.spaces.current.map(space => space.attributes.name))
      .do(val => console.log('labelSpaceStr', val));
  }

}
