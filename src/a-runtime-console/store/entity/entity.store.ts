import { plural } from 'pluralize';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Observable } from 'rxjs';
import { BaseEntity } from './entity.model';
import { RESTService } from './rest.service';

export abstract class AbstractStore<T extends BaseEntity, L extends Array<T>,
  R extends RESTService<T, L>> {

  protected _list: BehaviorSubject<L>;

  protected _current: BehaviorSubject<T>;

  protected _loading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  protected _loadId: string = null;

  constructor(protected service: R, initialList: L, initialCurrent: T) {
    this._list = new BehaviorSubject(initialList);
    this._current = new BehaviorSubject(initialCurrent);
  }

  protected abstract get kind(): string;

  get list(): Observable<L>  { return this._list.asObservable(); }

  get resource(): Observable<T> { return this._current.asObservable(); }

  get loading(): Observable<boolean>  { return this._loading.asObservable(); }

  delete(obj: T): Observable<any> {
    return this.service.delete(obj);
  }

  update(obj: T): Observable<T> {
   return this.service.update(obj);
  }

  loadAll(): Observable<L> {
    this._loadId = null;
    this._loading.next(true);
    let listObserver = this.service.list(this.listQueryParams());
    listObserver.subscribe(
      (list) => {
        this._list.next(list);
        this._loading.next(false);
      },
      (error) => {
        console.log('Error retrieving ' + plural(this.kind) + ': ' + error);
        this._loading.next(false);
      });
    return listObserver;
  }

  load(id: string) {
    this._loadId = id;
    this._loading.next(true);
    this.service.get(id).subscribe(
      (entity) => {
        this._current.next(entity);
        this._loading.next(false);
      },
      (error) => {
        console.log('Error retrieving ' + this.kind + ': ' + error);
        this._loading.next(false);
      });
  }

  reload() {
    let id = this._loadId;
    if (id) {
      this.load(id);
    } else {
      this.loadAll();
    }
  }

  listQueryParams() {
    return null;
  }
}
