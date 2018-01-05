import { Injectable } from "@angular/core";
import { BuildConfigService } from "../service/buildconfig.service";
import { BuildConfig, BuildConfigs } from "../model/buildconfig.model";
import { NamespacedResourceStore } from "./namespacedresource.store";
import { DevNamespaceScope } from "../service/devnamespace.scope";

@Injectable()
export class BuildConfigStore extends NamespacedResourceStore<BuildConfig, BuildConfigs, BuildConfigService> {
  constructor(buildconfigBuildConfig: BuildConfigService, namespaceScope: DevNamespaceScope) {
    super(buildconfigBuildConfig, [], <BuildConfig> {}, namespaceScope, BuildConfig);
  }

  protected get kind() {
    return 'BuildConfig';
  }
}
