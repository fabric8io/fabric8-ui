import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { KubernetesResource } from '../model/kubernetesresource.model';
import { INamespaceScope, NamespaceScope } from '../service/namespace.scope';
import { NamespacedResourceService } from '../service/namespaced.resource.service';
import { KubernetesResourceStore } from './kuberentesresource.store';

@Injectable()
export abstract class NamespacedResourceStore<T extends KubernetesResource, L extends Array<T>, R extends NamespacedResourceService<T, L>> extends KubernetesResourceStore<T, L, R> {
  private namespaceSubscription: Subscription;

  constructor(service: any, initialList: any, initialCurrent: any, public namespaceScope: INamespaceScope, type: any) {
    super(service, initialList, initialCurrent, type);
    if (this.namespaceScope) {
      this.namespaceSubscription = this.namespaceScope.namespace.subscribe(
        namespace => {
          this.service.namespace = namespace;
          this.recreateWatcher();
          this.reload();
        }
      );
    }
  }

  get namespace(): string {
    return this.service.namespace;
  }
}
