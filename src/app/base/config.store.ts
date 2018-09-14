import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectableObservable, Observable } from 'rxjs';
import { map, publishReplay } from 'rxjs/operators';
import { ValWrapper } from './val-wrapper';

interface LoadCallback<T> {
  (json: any): T;
}

@Injectable()
export class ConfigStore {

  private _cache: Map<string, Observable<ValWrapper<any>>> = new Map();

  constructor(
    private http: HttpClient
  ) { }

  get<T>(name: string, load?: LoadCallback<T>): Observable<ValWrapper<T>> {
    if (this._cache.has(name)) {
      return this._cache
        .get(name);
    } else {
      let res = this.http
        .get(`/_config/${name}.config.json`).pipe(
        map(resp => {
          return {
            val: (resp as any),
            loading: false
          } as ValWrapper<T>;
        }),
        publishReplay(1)) as ConnectableObservable<ValWrapper<T>>;
      this._cache.set(name, res);
      res.connect();
      return res;
    }
  }

  clear() {
    this._cache = new Map();
  }
}
