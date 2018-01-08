import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';
import { Build, Builds } from '../model/build.model';
import { pathJoin } from '../model/utils';
import { APIsStore } from '../store/apis.store';
import { getOpenShiftBuildUriPrefix } from './buildconfig.service';
import { DevNamespaceScope } from './devnamespace.scope';
import { KUBERNETES_RESTANGULAR } from './kubernetes.restangular';
import { NamespacedResourceService } from './namespaced.resource.service';
import { WatcherFactory } from './watcher-factory.service';

@Injectable()
export class BuildService extends NamespacedResourceService<Build, Builds> {

  constructor(
    @Inject(KUBERNETES_RESTANGULAR) kubernetesRestangular: Restangular,
    namespaceScope: DevNamespaceScope,
    private apiStore: APIsStore,
    watcherFactory: WatcherFactory
  ) {
    super(kubernetesRestangular, namespaceScope, '/builds', watcherFactory, getOpenShiftBuildUriPrefix());

    apiStore.loading.subscribe(loading => {
      if (!loading) {
        // force recalculation of the URL
        this._serviceUrl = null;
      }
    });
  }

  protected createServiceUrl(urlPrefix: string, namespace: string, urlSuffix: string): string {
    if (namespace) {
      return super.createServiceUrl(urlPrefix, namespace, urlSuffix);
    }
    return '';
  }

}
