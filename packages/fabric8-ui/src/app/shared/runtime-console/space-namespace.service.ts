import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as yaml from 'js-yaml';
import { Notifications, NotificationType } from 'ngx-base';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { forkJoin, Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, first, map, switchMap, tap } from 'rxjs/operators';
import { ConfigMap, ConfigMapService } from '../../../a-runtime-console/index';
import { DevNamespaceScope } from '../../../a-runtime-console/kubernetes/service/devnamespace.scope';
import { Fabric8UIConfig } from '../config/fabric8-ui-config';
import { Fabric8RuntimeConsoleService } from './fabric8-runtime-console.service';

interface ConfigMapWrapper {
  configMap?: ConfigMap;
  configMaps?: ConfigMap[];
  data?: Map<string, any[]>;
  space?: Space;
  namespace?: string;
}

// TODO Rename this so it doesn't clash with fabric8-ui-space-namespace.service
@Injectable()
export class SpaceNamespaceService {
  constructor(
    private userService: UserService,
    private fabric8UIConfig: Fabric8UIConfig,
    private configMapService: ConfigMapService,
    private spaces: Spaces,
    private notifications: Notifications,
    private devNamespace: DevNamespaceScope,
    private fabric8RuntimeConsoleService: Fabric8RuntimeConsoleService,
  ) {}

  getConfigMap(): Observable<ConfigMapWrapper> {
    return forkJoin(
      this.buildNamespace().pipe(first()),
      this.fabric8RuntimeConsoleService.loading(),
      (namespace, loading) => namespace,
    ).pipe(
      switchMap((namespace) =>
        this.configMapService.list(namespace).pipe(
          map(
            (configMaps) => ({ namespace: namespace, configMaps: configMaps } as ConfigMapWrapper),
          ),
          catchError((err: HttpErrorResponse, caught) => {
            if (err.status === 403) {
              let errDetail;
              try {
                errDetail = yaml.safeLoad(err.message);
              } catch (e) {
                // Swallow an exception from the YAML parser, we'll just dump the entire response in this case.
              }
              this.notifications.message({
                message: `Something went wrong configuring your pipelines and environments as the OpenShift Project '${namespace}' is not accessible to you or does not exist.`,
                type: NotificationType.WARNING,
              });
            }
            return observableThrowError(err);
          }),
        ),
      ),
      map((val) => {
        for (let configMap of val.configMaps) {
          if (configMap.labels['kind'] === 'spaces' && configMap.labels['provider'] === 'fabric8') {
            val.configMap = configMap;
          }
        }
        return val as ConfigMapWrapper;
      }),
      tap((val) => {
        let res: Map<string, any[]> = new Map();
        if (val.configMap) {
          for (let c in val.configMap) {
            if (val.configMap.data.hasOwnProperty(c)) {
              res.set(c, yaml.safeLoad(val.configMap.data[c]));
            }
          }
        }
        val.data = res;
      }),
    );
  }

  updateConfigMap(spaceObservable: Observable<Space>): Observable<ConfigMap> {
    return forkJoin(
      this.getConfigMap().pipe(first()),
      spaceObservable.pipe(first()),
      (val, space) => {
        val.space = space;
        return val;
      },
    ).pipe(
      tap((val) => {
        if (val.space) {
          val.data[val.space.attributes.name] = val.data.get(val.space.attributes.name) || {};
          val.data[val.space.attributes.name]['name'] = val.space.attributes.name;
          if (val.space.attributes.description) {
            val.data[val.space.attributes.name]['description'] = val.space.attributes.description;
          }
          val.data[val.space.attributes.name]['creator'] =
            val.space.relationalData.creator.attributes.username;
          val.data[val.space.attributes.name]['id'] = val.space.id;
          val.data[val.space.attributes.name]['version'] = 'v1';
        }
      }),
      switchMap((val) => {
        let cm = val.configMap;
        if (!cm) {
          cm = new ConfigMap();
          cm.data = new Map();
          cm.labels = new Map();
          cm.labels['kind'] = 'spaces';
          cm.labels['provider'] = 'fabric8';
          cm.annotations = new Map();
          cm.description = 'Defines the spaces within this namespace';
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
        }
        return this.configMapService.create(cm, cm.namespace);
      }),
    );
  }

  buildNamespace(): Observable<string> {
    return this.devNamespace.namespace;
  }
}
