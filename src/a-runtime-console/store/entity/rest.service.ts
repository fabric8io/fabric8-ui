import { Restangular } from 'ng2-restangular';
import { Observable } from 'rxjs/Observable';

import { BaseEntity } from './entity.model';

export abstract class RESTService<T extends BaseEntity, L extends Array<T>> {

  protected constructor(protected restangularService: Restangular) { }

  get(id: string): Observable<T> {
    return this.restangularService.one(id).get();
  }

  list(queryParams: any = null): Observable<L> { return this.restangularService.getList(queryParams); }

  create(obj: T): Observable<T> { return this.restangularService.post(obj); }

  update(obj: T): Observable<T> {
    return this.restangularService.one(obj.id).put(obj);
  }

  delete(obj: T) { return this.restangularService.one(obj.id).delete(); }



  /**
   * If a new item has been loaded via a websocket then lets restanguarlize it
   * so that the REST APIs appear on it
   */
  restangularize(item: T): T {
    let restangularService = this.restangularService;
    let parent = restangularService.parentResource;
    let route = restangularService.route;
    let fromServer = restangularService.fromServer;
    let collection = restangularService.restangularCollection;
    let reqParams = restangularService.reqParams;
    return this.restangularService.restangularizeElement(parent, item, route, fromServer, collection, reqParams);
  }

}
