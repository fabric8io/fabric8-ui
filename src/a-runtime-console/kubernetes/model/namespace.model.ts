import { KubernetesResource } from './kubernetesresource.model';

export class Namespace extends KubernetesResource {
  environments: Map<string, Namespace>;

  /* The owning space/team for an environment - or null for an environment */
  space: Namespace;

  defaultKind() {
    return 'Namespace';
  }


  defaultIconUrl(): string {
    return "";
  }
}

export class Namespaces extends Array<Namespace>{
}

export function isSecretsNamespace(namespace: Namespace) {
  return namespace && namespace.labels["group"] === "secrets";
}

export function isSystemNamespace(namespace: Namespace) {
  return namespace && systemNamespaceNames[namespace.name];
}

const systemNamespaceNames = {
  'kube-system': 'kubernetes',
  'openshift': 'openshift',
  'openshift-infra': 'openshift',
};

