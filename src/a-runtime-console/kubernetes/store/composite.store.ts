import { BaseEntity } from "../../store/entity/entity.model";
import { BehaviorSubject, Observable } from "rxjs";

// export abstract class CompositeStore<T extends BaseEntity, L extends Array<T>> {
//
//   protected _list: BehaviorSubject<L>;
//
//   protected _current: BehaviorSubject<T>;
//
//   protected _loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
//
//   protected _loadId: string = null;
//
//   constructor(initialList: L, initialCurrent: T) {
//     this._list = new BehaviorSubject(initialList);
//     this._current = new BehaviorSubject(initialCurrent);
//   }
//
//   get list(): Observable<L> {
//     return this._list.asObservable();
//   }
//
//   get resource(): Observable<T> {
//     return this._current.asObservable();
//   }
//
//   get loading(): Observable<boolean> {
//     return this._loading.asObservable();
//   }
//
//   loadAll(): Observable<L> {
//     this._loadId = null;
//     this._loading.next(true);
//     return this.list();
//   }
//
//   load(id: string): void {
//     this._loadId = id;
//     this._loading.next(true);
//   }
//
//   reload() {
//     let id = this._loadId;
//     if (id) {
//       this.load(id);
//     } else {
//       this.loadAll();
//     }
//   }
// }
