import { Injectable } from '@angular/core';
import { Namespace, Namespaces } from '../model/namespace.model';
import { NamespaceService } from '../service/namespace.service';
import { KubernetesResourceStore } from './kuberentesresource.store';

@Injectable()
export class NamespaceStore extends KubernetesResourceStore<Namespace, Namespaces, NamespaceService> {
  constructor(namespaceNamespace: NamespaceService) {
    super(namespaceNamespace, [], <Namespace> {}, Namespace);
  }


  protected get kind() {
    return 'Namespace';
  }
}
