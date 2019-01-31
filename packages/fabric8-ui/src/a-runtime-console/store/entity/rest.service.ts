import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs';
import { BaseEntity } from './entity.model';

export abstract class RESTService<T extends BaseEntity, L extends Array<T>> {
  protected constructor(protected restangularService: Restangular) {}

  get(id: string): Observable<T> {
    return this.restangularService.one(id).get();
  }

  list(queryParams: any = null): Observable<L> {
    return this.restangularService.getList(queryParams);
  }

  create(obj: T): Observable<T> {
    return this.restangularService.post(obj);
  }

  update(obj: T): Observable<T> {
    return this.restangularService.one(obj.id).put(obj);
  }

  delete(obj: T) {
    return this.restangularService.one(obj.id).delete();
  }

  /**
   * If a new item has been loaded via a websocket then lets restanguarlize it
   * so that the REST APIs appear on it
   */
  restangularize(item: T): T {
    const restangularService = this.restangularService;
    const parent = restangularService.parentResource;
    const route = restangularService.route;
    const fromServer = restangularService.fromServer;
    const collection = restangularService.restangularCollection;
    const reqParams = restangularService.reqParams;
    return this.restangularService.restangularizeElement(
      parent,
      item,
      route,
      fromServer,
      collection,
      reqParams,
    );
  }
}
