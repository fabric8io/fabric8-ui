import { Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Spaces, Space } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { UserService } from 'ngx-login-client';
import { ConfigMapService, ConfigMap } from 'fabric8-runtime-console';
import { Notifications, NotificationType } from 'ngx-base';

import * as yaml from 'js-yaml';

import { Fabric8RuntimeConsoleService } from './fabric8-runtime-console.service';
import { ObservableFabric8UIConfig } from './../config/fabric8-ui-config.service';


interface ConfigMapWrapper {
  configMap?: ConfigMap;
  configMaps?: ConfigMap[];
  data?: Map<string, any[]>;
  space?: Space;
  namespace?: string;
}

@Injectable()
export class SpaceNamespaceService {

  constructor(
    private userService: UserService,
    private fabric8UIConfig: ObservableFabric8UIConfig,
    private configMapService: ConfigMapService,
    private spaces: Spaces,
    private notifications: Notifications,
    private fabric8RuntimeConsoleService: Fabric8RuntimeConsoleService
  ) { }

  getConfigMap(): Observable<ConfigMapWrapper> {
    return Observable.forkJoin(
      this.buildNamespace().first(),
      this.fabric8RuntimeConsoleService.loading(),
      (namespace, loading) => namespace
    )
      .switchMap(namespace => this.configMapService
        .list(namespace)
        .map(configMaps => ({ namespace: namespace, configMaps: configMaps } as ConfigMapWrapper))
        .catch((err: Response, caught) => {
          if (err.status === 403) {
            let errDetail;
            try {
              errDetail = yaml.safeLoad(err.text());
            } catch (e) {
              // Swallow an exception from the YAML parser, we'll just dump the entire response in this case.
            }
            console.log('Namespace does not exist or is not accessible and OpenShift gave a 403.', errDetail || err.text());
            this.notifications.message({
              message: `Something went wrong configuring your pipelines and environments as the OpenShift Project '${namespace}' is not accessible to you or does not exist.`,
              type: NotificationType.WARNING
            });
          }
          return Observable.throw(err);
        })
      )
      .map(val => {
        for (let configMap of val.configMaps) {
          if (configMap.labels['kind'] === 'spaces' && configMap.labels['provider'] === 'fabric8') {
            val.configMap = configMap;
          }
        }
        return val as ConfigMapWrapper;
      })
      .do(val => {
        let res: Map<string, any[]> = new Map();
        if (val.configMap)
          for (let c in val.configMap) {
            if (val.configMap.data.hasOwnProperty(c)) {
              res.set(c, yaml.safeLoad(val.configMap.data[c]));
            }
          }
        val.data = res;
      });
  }

  updateConfigMap(spaceObservable: Observable<Space>): Observable<ConfigMap> {
    return Observable.forkJoin(
      this.getConfigMap().first(),
      spaceObservable.first(),
      (val, space) => {
        val.space = space;
        return val;
      }
    )
      .do(val => {
        val.data[val.space.attributes.name] = val.data.get(val.space.attributes.name) || {};
        val.data[val.space.attributes.name]['name'] = val.space.attributes.name;
        if (val.space.attributes.description) {
          val.data[val.space.attributes.name]['description'] = val.space.attributes.description;
        }
        val.data[val.space.attributes.name]['creator'] = val.space.relationalData.creator.attributes.username;
        val.data[val.space.attributes.name]['id'] = val.space.id;
        val.data[val.space.attributes.name]['version'] = 'v1';
      })
      .switchMap(val => {
        let cm = val.configMap;
        if (!cm) {
          cm = new ConfigMap();
          cm.data = new Map();
          cm.labels = new Map();
          cm.labels.set('kind', 'spaces');
          cm.labels.set('provider', 'fabric8');
          cm.annotations = new Map();
          cm.annotations.set('description', 'Defines the spaces within this namespace');
          cm.name = 'fabric8-spaces';
          cm.namespace = val.namespace;
        }
        let i = 0;
        for (let d in val.data) {
          if (val.data.hasOwnProperty(d)) {
            val.data[d]['order'] = i;
            cm.data[d] = yaml.safeDump(val.data[d]);
          }
        }
        if (val.configMap) {
          return this.configMapService.update(cm);
        } else {
          return this.configMapService.create(cm, cm.namespace);
        }
      });
  }

  buildNamespace(): Observable<string> {
    return Observable.forkJoin(
      this.userService
        .loggedInUser
        .map(user => user.attributes.username)
        .first(),
      this.fabric8UIConfig
        .map(config => config.pipelinesNamespace)
        .first(),
      (username: string, namespace: string) => ({ username, namespace })
    )
      .map(val => `${val.username}${val.namespace}`);
  }

}
