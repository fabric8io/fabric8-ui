import { ActivatedRoute } from '@angular/router';
import { OAuthConfig } from '../store/oauth-config-store';
import { KubernetesResource } from './kubernetesresource.model';
import { pathJoin } from './utils';

export const resourceKindToCollectionName = {
  Deployment: 'deployments',
  DeploymentConfig: 'deploymentconfigs',
  Build: 'builds',
  BuildConfig: 'buildsconfigs',
  ConfigMap: 'configmaps',
  Event: 'events',
  Namespace: 'spaces',
  Pod: 'pods',
  Project: 'projects',
  ReplicationController: 'replicationcontrollers',
  ReplicaSet: 'replicasets',
  Route: 'routes',
  Service: 'services',
};

export const resourceKindToOpenShiftConsoleCollectionName = {
  BuildConfig: 'pipelines',
  DeploymentConfig: 'dc',
  ReplicationController: 'rc',
};

/**
 * Returns true if the resource kind is namespaced
 */
export function isNamespacedKind(kind: string) {
  if (kind) {
    return kind !== 'Namespace' && kind !== 'Project' && kind !== 'PersistentVolume';
  }
  return false;
}

/**
 * Given the resource generate a link to browse the resource on the OpenShift web console
 */
export function openShiftBrowseResourceUrl(
  resource: KubernetesResource,
  oauthConfig: OAuthConfig,
  openShiftConsoleUrl: string = null,
  kinds: string = null,
): string {
  if (resource) {
    let oscUrl: string = openShiftConsoleUrl;
    let k: string = kinds;
    if (!openShiftConsoleUrl) {
      oscUrl = oauthConfig.openshiftConsoleUrl;
    }
    if (!kinds) {
      let kind = resource.defaultKind();
      if (!kind || kind === 'Unknown') {
        const k8sResource = resource.resource;
        if (k8sResource) {
          kind = k8sResource.kind;
        }
      }
      if (kind) {
        k =
          resourceKindToOpenShiftConsoleCollectionName[kind] || resourceKindToCollectionName[kind];
        if (!k) {
          console.log(`Could not find collection name for kind: ${kind}`);
          k = kind.toLowerCase();
          if (!k.endsWith('s')) {
            k += 's';
          }
        }
      }
    }
    const name = resource.name;
    const namespace = resource.namespace;
    if (k === 'builds' && name && namespace) {
      const pipelineName = resource['buildConfigName'] || name;
      return pathJoin(oscUrl, '/project/', namespace, '/browse/pipelines', pipelineName, name);
    }
    if (k === 'spaces' || k === 'projects') {
      if (name) {
        return pathJoin(oscUrl, '/project/', name, '/overview');
      }
    } else if (resource && oscUrl && namespace && name) {
      return pathJoin(oscUrl, '/project/', namespace, '/browse', k, name);
    }
  }
  return '';
}

/**
 * Returns the activated route data flag of this route or a parent route or null if it could not be found
 */
export function activedRouteDataEntry(route: ActivatedRoute, key: string) {
  if (route) {
    const data = route.snapshot.data;
    if (data) {
      const answer = data[key];
      if (answer != undefined) {
        return answer;
      }
      const parent = route.parent;
      if (parent) {
        return activedRouteDataEntry(parent, key);
      }
    }
  }
  return null;
}

export function findParameter(route: ActivatedRoute, name: string): string {
  if (route) {
    let snapshot = route.snapshot;
    while (snapshot) {
      const answer = snapshot.params[name];
      if (answer) {
        return answer;
      }
      snapshot = snapshot.parent;
    }
  }
  return null;
}
