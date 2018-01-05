import { Injectable } from "@angular/core";
import { BuildService } from "../service/build.service";
import { Build, Builds } from "../model/build.model";
import { NamespacedResourceStore } from "./namespacedresource.store";
import { DevNamespaceScope } from "../service/devnamespace.scope";

@Injectable()
export class BuildStore extends NamespacedResourceStore<Build, Builds, BuildService> {
  constructor(buildconfigBuild: BuildService, namespaceScope: DevNamespaceScope) {
    super(buildconfigBuild, [], <Build> {}, namespaceScope, Build);
  }

  protected get kind() {
    return 'Build';
  }
}
