import {Injectable} from "@angular/core";
import {Namespaces, Namespace, isSecretsNamespace, isSystemNamespace} from "../model/namespace.model";
import {Observable, BehaviorSubject, Subscription} from "rxjs";
import {NamespaceStore} from "./namespace.store";
import {ConfigMapService} from "../service/configmap.service";
import {Space, Spaces, asSpaces, SpaceConfig} from "../model/space.model";
import {ConfigMap, ConfigMaps} from "../model/configmap.model";
import "rxjs/add/observable/forkJoin";
import {OnLogin} from "../../shared/onlogin.service";
import {messageEventToResourceOperation, Operation} from "../service/resource-operation";
import {Watcher} from "../service/watcher";
import {ConfigMapStore} from "./configmap.store";


const fabric8EnvironmentsName = "fabric8-environments";
const fabric8SpacesName = "fabric8-spaces";


class SpaceConfigWatcher {
  protected spaceConfigSubject: BehaviorSubject<SpaceConfig> = new BehaviorSubject(null);
  protected spaceConfig: SpaceConfig;
  protected subscription: Subscription;
  public notified: boolean;

  constructor(protected configMapStore: ConfigMapStore, public watcher: Watcher<ConfigMaps>, protected onChangeFn: (SpaceConfig) => void) {
    this.subscription = watcher.dataStream.subscribe(msg => {
      this.onMessageEvent(msg);
    });
  }

  protected onMessageEvent(msg) {
    let resourceOperation = messageEventToResourceOperation(msg);
    if (resourceOperation) {
      if (resourceOperation.operation == Operation.DELETED) {
        this.spaceConfig = null;
        this.notify(this.spaceConfig);
      } else {
        let resource = resourceOperation.resource;
        let configMap = this.configMapStore.instantiate(resource);
        if (configMap) {
          let old = this.spaceConfig;
          var environmentsConfigMap: ConfigMap = old ? old.environmentsConfigMap : null;
          var spacesConfigMap: ConfigMap = old ? old.spacesConfigMap : null;

          if (configMap.name === fabric8EnvironmentsName) {
            environmentsConfigMap = configMap;
          } else if (configMap.name === fabric8SpacesName) {
            spacesConfigMap = configMap;
          }
          this.spaceConfig = new SpaceConfig(configMap.namespace, environmentsConfigMap, spacesConfigMap);
          this.notify(this.spaceConfig);
        }
      }
    }
  }

  public notify(spaceConfig: SpaceConfig) {
    this.spaceConfigSubject.next(spaceConfig);
    if (this.onChangeFn) {
      this.onChangeFn(spaceConfig);
    }
    this.notified = true;
  }
}

@Injectable()
export class SpaceStore {
  public list: Observable<Spaces>;
  public resource: Observable<Space>;
  private _idSubject: BehaviorSubject<string> = new BehaviorSubject("");
  protected _loading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private spaceConfigWatchers: Map<String,SpaceConfigWatcher>;
  private spaceConfigs: Map<String,SpaceConfig>;
  protected spaceConfigsSubject: BehaviorSubject<Map<String,SpaceConfig>>;

  constructor(private namespaceStore: NamespaceStore, configMapService: ConfigMapService, configMapStore: ConfigMapStore, private onLogin: OnLogin) {
    let namespacesList = this.namespaceStore.list;

    this.spaceConfigWatchers = new Map<String,SpaceConfigWatcher>();
    this.spaceConfigs = new Map<String,SpaceConfig>();
    this.spaceConfigsSubject = new BehaviorSubject(this.spaceConfigs);

    this.list = namespacesList.combineLatest(this.spaceConfigsSubject.asObservable(), this.combineNamespacesAndConfigMaps);

    this.resource = this.list.combineLatest(this._idSubject.asObservable(), (spaces, id) => {
      for (let space of spaces) {
        if (space.name === id) {
          return space;
        }
      }
      return null;
    });

    // lets make sure we've always got an up to date map of configmaps
    namespacesList.subscribe(namespaces => {
      if (namespaces) {
        for (let namespace of namespaces) {
          if (isSecretsNamespace(namespace) || isSystemNamespace(namespace)) {
            // we don't need to watch these!
            continue;
          }
          var name = namespace.name;
          if (name) {
            var springConfigWatcher = this.spaceConfigWatchers[name];
            if (!springConfigWatcher) {
              //console.log("watching configmaps in namespace " + name);
              let watcher = configMapService.watchNamepace(name, {
                labelSelector: "provider=fabric8"
              });
              springConfigWatcher = new SpaceConfigWatcher(configMapStore, watcher, (spaceConfig) => this.spaceConfigUpdated(spaceConfig));

              // lets load the initial value
              configMapService.list(name, {
                labelSelector: "provider=fabric8"
              }).take(1).subscribe(cms => {
                if (cms && cms.length) {
                  var environmentsConfigMap: ConfigMap = null;
                  var spacesConfigMap: ConfigMap = null;
                  for (let c of cms) {
                    if (c.name === fabric8EnvironmentsName) {
                      environmentsConfigMap = c;
                    } else if (c.name === fabric8SpacesName) {
                      spacesConfigMap = c;
                    }
                  }
                  let namespace = (environmentsConfigMap ? environmentsConfigMap.namespace : null)
                    || (spacesConfigMap ? spacesConfigMap.namespace : null);
                  if (namespace) {
                    springConfigWatcher.notify(new SpaceConfig(namespace, environmentsConfigMap, spacesConfigMap));
                  }
                }
              });
              this.spaceConfigWatchers[name] = springConfigWatcher;
            }
          }
        }
        this.checkIfLoaded();
      }
    });
  }

  protected combineNamespacesAndConfigMaps(namespaces: Namespaces, spaceConfigs: Map<String,SpaceConfig>): Spaces {
    var spaces = [];
    if (namespaces) {
      for (let namespace of namespaces) {
        let name = namespace.name;
        if (name) {
          let spaceConfig = spaceConfigs.get(name);
          let space = new Space(namespace, namespaces, spaceConfig);
          spaces.push(space);
        }
      }
    }
    return asSpaces(spaces);
  }

  protected spaceConfigUpdated(spaceConfig: SpaceConfig) {
    let name = spaceConfig.namespace;
    if (spaceConfig == null) {
      this.spaceConfigs.delete(name);
    } else {
      this.spaceConfigs.set(name, spaceConfig);
    }
    this.spaceConfigsSubject.next(this.spaceConfigs);
    this.checkIfLoaded();
  }


  protected checkIfLoaded() {
    // if we have loaded all environments lets mark the store as loaded
    var loaded = true;
    this.spaceConfigWatchers.forEach((environmentWatcher) => {
      if (!environmentWatcher.notified) {
        loaded = false;
      }
    });
    if (loaded) {
      // we've now loaded!
      this._loading.next(false);
    }
  }

  get loading(): Observable<boolean> {
    return this._loading.asObservable();
  }

  loadAll(): void {
    this.doLoad();
  }

  load(id: string): void {
    this._idSubject.next(id);
    this.doLoad();
  }

  protected doLoad(): void {
    this._loading.next(true);
    this.namespaceStore.loadAll();
  }

  update(obj: Space): Observable<Namespace> {
    return this.namespaceStore.update(obj.namespace);
  }

  updateResource(obj: Space, resource: any): Observable<Namespace> {
    return this.namespaceStore.updateResource(obj.namespace, resource);
  }


  delete(space: Space): Observable<any> {
    return this.namespaceStore.delete(space.namespace);
  }
}
