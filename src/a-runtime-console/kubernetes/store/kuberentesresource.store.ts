import { AbstractStore } from "../../store/entity/entity.store";
import { KubernetesService } from "../service/kubernetes.service";
import { KubernetesResource } from "../model/kubernetesresource.model";
import { Observable, BehaviorSubject } from "rxjs";
import { Watcher } from "../service/watcher";
import { plural } from "pluralize";
import { messageEventToResourceOperation, Operation } from "../service/resource-operation";
import { isNewerResource } from "../service/poller";

function nameOfResource(resource: any): string {
  let obj = resource || {};
  let metadata = obj.metadata || {};
  return metadata.name || "";
}

export abstract class KubernetesResourceStore<T extends KubernetesResource, L extends Array<T>, R extends KubernetesService<T, L>> extends AbstractStore<T, L, R> {
  protected watcher: Watcher<L>;

  constructor(service: R, private initialList: L, initialCurrent: T, protected type: { new(): T; }) {
    super(service, initialList, initialCurrent);
  }

  /**
   * Creates a new instance of the resource type from the given data - typically received from a web socket event
   */
  instantiate(resource: any): T {
    if (resource) {
      let item = new this.type();
      item.setResource(resource);
      // lets add the Restangular crack
      return this.service.restangularize(item);
    } else {
      return null;
    }
  }



  update(obj: T): Observable<T> {
    return this.service.update(obj);
  }

  updateResource(obj: T, resource: any): Observable<T> {
    return this.service.updateResource(obj, resource);
  }

  delete(obj: T): Observable<any> {
    return this.service.delete(obj);
  }

  loadAll(): Observable<L> {
    this.doLoadAll();
    return this.list;
  }

  protected doLoadAll() {
    this._loadId = null;
    this._loading.next(true);
    let listObserver = this.service.list(this.listQueryParams());
    if (this.watcher) {
      // TODO should we recreate as the URL can have changed?
      this.watcher.recreateIfChanged();
    } else {
      this.watcher = this.service.watch();
    }
    let dataStream = this.watcher.dataStream;

    var latestList = this.initialList;
    var latestMsg = null;

    var subject = new BehaviorSubject(latestList);

    // lets not use Observable.combineLatest() so that we have more control over error handling
    // as we wanna just ignore websocket errors really
    listObserver.subscribe(list => {
        latestList = list;
        const result = this.combineListAndWatchEvent(latestList, latestMsg);
        if (result) {
          subject.next(result);
        }
    },
    (error) => {
      console.log('Error retrieving list ' + plural(this.kind) + ': ' + error);
      this._loading.next(false);
    });

    dataStream.subscribe(msg => {
        latestMsg = msg;
        const result = this.combineListAndWatchEvent(latestList, latestMsg);
        if (result) {
          subject.next(result);
        }
      this._loading.next(false);
    },
    (error) => {
      console.log('Error watching websockets on ' + plural(this.kind) + ': ' + error);
    });

    subject.subscribe(list => {
      this._list.next(list);
      this._loading.next(false);
    },
    (error) => {
      console.log('Error on joined stream ' + plural(this.kind) + ': ' + error);
    });
  }

  protected recreateWatcher() {
    if (this.watcher) {
      this.watcher.recreate();
    } else {
      this.watcher = this.service.watch();
    }
  }


  /**
   * Lets combine the web socket events with the latest list
   */
  protected combineListAndWatchEvent(array: L, msg: any): L {
    let resourceOperation = messageEventToResourceOperation(msg);
    if (resourceOperation) {
      // lets process the added /updated / removed
      let operation = resourceOperation.operation;
      let resource = resourceOperation.resource;
      switch (operation) {
        case Operation.ADDED:
          return this.upsertItem(array, resource);
        case Operation.MODIFIED:
          return this.upsertItem(array, resource);
        case Operation.DELETED:
          return this.deleteItemFromArray(array, resource);
        default:
          console.log('Unknown resource option ' + operation + ' for ' + resource + ' on ' + this.service.serviceUrl);
      }
    }

/*
    if (msg instanceof MessageEvent) {
      let me = msg as MessageEvent;
      let data = me.data;
      if (data) {
        var json = JSON.parse(data);
        if (json) {
          let type = json.type;
          let resource = json.object;
          if (type && resource) {
            switch (type) {
              case "ADDED":
                return this.upsertItem(array, resource);
              case "MODIFIED":
                return this.upsertItem(array, resource);
              case "DELETED":
                return this.deleteItemFromArray(array, resource);
              default:
                console.log("Unknown WebSocket event type " + type + " for " + resource + " on " + this.service.serviceUrl);
            }
          }
        }
      }
    }
*/
    return array;
  }

  protected upsertItem(array: L, resource: any): L {
    let n = nameOfResource(resource);
    if (array && n) {
      for (let item of array) {
        var name = item.name;
        if (name && name === n) {
          if (isNewerResource(resource, item.resource)) {
            item.setResource(resource);
          }
          //console.log("Updated item " + n);
          return array;
        }
      }

      // now lets add the new item!
      let item = new this.type();
      item.setResource(resource);
      // lets add the Restangular crack
      item = this.service.restangularize(item);
      array.push(item);
      //console.log("Added new item " + n);
      return array;
    }
    return null;
  }


  protected deleteItemFromArray(array: L, resource: any): L {
    let n = nameOfResource(resource);
    if (array && n) {
      for (var i = 0; i < array.length; i++) {
        let item = array[i];
        var name = item.name;
        if (name && name === n) {
          array.splice(i, 1);
          return array;
        }
      }
    }
    return null;
  }

  load(id: string): void {
    super.load(id);
  }

  listQueryParams() {
    return null;
  }
}
