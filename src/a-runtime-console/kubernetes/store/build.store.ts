import { Injectable } from '@angular/core';
import { Build, Builds } from '../model/build.model';
import { BuildService } from '../service/build.service';
import { DevNamespaceScope } from '../service/devnamespace.scope';
import { NamespacedResourceStore } from './namespacedresource.store';

@Injectable()
export class BuildStore extends NamespacedResourceStore<Build, Builds, BuildService> {
  constructor(buildconfigBuild: BuildService, namespaceScope: DevNamespaceScope) {
    super(buildconfigBuild, [], <Build> {}, namespaceScope, Build);
  }

  protected get kind() {
    return 'Build';
  }
}
