import * as jsyaml from 'js-yaml';

import { Entity } from '../../models/entity';
import { currentOAuthConfig } from '../store/oauth-config-store';
import { ConfigMap } from './configmap.model';
import { openShiftBrowseResourceUrl } from './helpers';
import { isSecretsNamespace, isSystemNamespace, Namespace, Namespaces } from './namespace.model';


export class SpaceConfig {
  constructor(public namespace: string, public environmentsConfigMap: ConfigMap, public spacesConfigMap: ConfigMap) {
  }
}

/**
 * Allows a namespace to be split up into separate logical spaces using labels in kubernetes/openshift
 */
export class LabelSpace implements Entity {
  constructor(public name: string, public label: string, public description: string, public order: number) {
  }

  get id(): string {
    return this.name;
  }
}

export class Space {
  id: string;
  name: string;
  environments: Environment[] = [];
  labelSpaces: LabelSpace[] = [];
  jenkinsNamespace: Namespace;
  cheNamespace: Namespace;

  /**
   * Returns the namespace of the first environment or if there are none then this namespace name
   */
  firstEnvironmentNamespace: string;

  constructor(public namespace: Namespace, namespaces: Namespaces, public spaceConfig: SpaceConfig) {
    if (namespace) {
      this.id = namespace.id;
      this.name = namespace.name;
      this.firstEnvironmentNamespace = this.name;
    }

    let map = new Map<string, Namespace>();
    if (namespaces) {
      namespaces.forEach(ns => {
        const nsName = ns.name;
        map[nsName] = ns;

        if (nsName === this.name + '-jenkins') {
          this.jenkinsNamespace = ns;
        } else if (nsName === this.name + '-che') {
          this.cheNamespace = ns;
        }
      });
    }

    if (spaceConfig) {
      let environmentsConfigMap = spaceConfig.environmentsConfigMap;
      let spacesConfigMap = spaceConfig.spacesConfigMap;
      if (environmentsConfigMap) {
        this.environments = this.loadEnvironments(environmentsConfigMap, map);
        if (this.environments.length) {
          this.firstEnvironmentNamespace = this.environments[0].namespaceName || this.name;
        }
      }
      if (spacesConfigMap) {
        this.labelSpaces = this.loadLabelSpaces(spacesConfigMap);
      }
    }
  }

  /**
   * Returns the environment which contains the given key such as 'jenkins' or 'stage' or null if none can be found
   */
  findEnvironment(key: string): Environment {
    let environments = this.environments;
    if (environments) {
      for (let env of environments) {
        if (env.key === key) {
          return env;
        }
      }
    }
    return null;
  }


  protected loadEnvironments(configMap: ConfigMap, namespaceMap: Map<string, Namespace>): Environment[] {
    let answer = [];
    var data = configMap.data;
    if (data) {
      Object.keys(data).forEach((key) => {
        let yaml = data[key];
        if (yaml) {
          let config = jsyaml.safeLoad(yaml);
          let namespaceName = config['namespace'];
          if (namespaceName) {
            let ns = namespaceMap[namespaceName];
            if (ns) {
              var order = config.order;
              if (order === undefined) {
                order = 1000;
              }
              let env = new Environment(key, config.name || key, namespaceName, this, ns, config, order);
              answer.push(env);
            }
          }
        }
      });
    } else {
      console.log('No data for ConfigMap ' + configMap.name + ' in namespace ' + configMap.namespace);
    }

    answer.sort((a: Environment, b: Environment) => {
      if (a.order < b.order) {
        return -1;
      } else if (a.order > b.order) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    return answer;
  }

  private loadLabelSpaces(configMap: ConfigMap) {
    let answer = [];
    var data = configMap.data;
    if (data) {
      Object.keys(data).forEach((key) => {
        let yaml = data[key];
        if (yaml) {
          let config = jsyaml.safeLoad(yaml);
          let label = config['name'] || '';
          let description = config['description'] || '';
          var order = config.order;
          if (order === undefined) {
            order = 1000;
          }
          answer.push(new LabelSpace(key, label, description, order));
        }
      });
    } else {
      console.log('No data for ConfigMap ' + configMap.name + ' in namespace ' + configMap.namespace);
    }
    answer.sort((a: LabelSpace, b: LabelSpace) => {
      if (a.order < b.order) {
        return -1;
      } else if (a.order > b.order) {
        return 1;
      }
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
    return answer;
  }
}

export class Environment {
  openShiftConsoleUrl: string;

  constructor(public key: string, public name: string, public namespaceName: string, public space: Space, public namespace: Namespace, public config: any, public order: number) {
    if (namespace) {
      this.openShiftConsoleUrl = openShiftBrowseResourceUrl(namespace, currentOAuthConfig());
    }
  }
}

export class Spaces extends Array<Space>{
  /**
   * All the spaces whether a development Space a runtime Environment or a namespace for Secrets
   */
  all = new Array<Space>();

  /**
   * All the environments for all spaces
   */
  environments = new Array<Environment>();

  /**
   * All the namespaces used for storing user Secrets
   */
  secretNamespaces = new Array<Space>();

  /**
   * System namespaces
   */
  systemNamespaces = new Array<Space>();
}

export function createEmptySpace(): Space {
  return new Space(null, new Namespaces(), null);
}

export function asSpaces(spaces: Space[]): Spaces {
  var answer = new Spaces();
  if (spaces) {
    var nsNameToEnvMap = new Map<string, Environment>();
    for (let space of spaces) {
      if (space && space.environments) {
        for (let env of space.environments) {
          if (!nsNameToEnvMap[env.namespaceName]) {
            nsNameToEnvMap[env.namespaceName] = env;
            answer.environments.push(env);
          }
        }
      }
    }
    for (let space of spaces) {
      if (space) {
        let nsName = space.name;
        let environments = space.environments || [];
        if (!nsNameToEnvMap[nsName] || environments.length) {
          // this is a top level space not an environment
          if (isSecretsNamespace(space.namespace)) {
            answer.secretNamespaces.push(space);
          } else if (isSystemNamespace(space.namespace)) {
            answer.systemNamespaces.push(space);
          } else {
            answer.push(space);
          }
        }
        answer.all.push(space);
      }
    }
  }
  answer.sort((a, b) => (a.name || '').localeCompare(b.name));
  return answer;
}


