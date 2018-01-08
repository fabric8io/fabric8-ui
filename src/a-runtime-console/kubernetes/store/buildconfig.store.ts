import { Injectable } from '@angular/core';
import { BuildConfig, BuildConfigs } from '../model/buildconfig.model';
import { BuildConfigService } from '../service/buildconfig.service';
import { DevNamespaceScope } from '../service/devnamespace.scope';
import { NamespacedResourceStore } from './namespacedresource.store';

@Injectable()
export class BuildConfigStore extends NamespacedResourceStore<BuildConfig, BuildConfigs, BuildConfigService> {
  constructor(buildconfigBuildConfig: BuildConfigService, namespaceScope: DevNamespaceScope) {
    super(buildconfigBuildConfig, [], <BuildConfig> {}, namespaceScope, BuildConfig);
  }

  protected get kind() {
    return 'BuildConfig';
  }
}
