import { Observable, Subject, ReplaySubject } from 'rxjs';

import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Spaces, Space, WIT_API_URL } from 'ngx-fabric8-wit';

@Injectable()
export class SpacesService implements Spaces {
  private _current: Subject<Space> = new ReplaySubject(1);

  constructor(private http: Http, @Inject(WIT_API_URL) private baseApiUrl: string) {}

  get current(): Observable<Space> {
    return this._current.asObservable();
  }

  get recent(): Observable<Space[]> {
    throw new Error('Not yet implemented');
  }

  setCurrent(space: Space) {
    this._current.next(space);
  }

  getAllSpaces() {
    // Note: this only retrieves the first page of the spaces list
    // for simplification.
    return this.http.get(this.baseApiUrl + 'spaces').map((response) => response.json().data);
  }

  getSpace(id: string) {
    return this.http.get(this.baseApiUrl + 'spaces/' + id).map((response) => response.json().data);
  }
}
