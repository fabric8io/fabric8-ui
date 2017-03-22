import { Broadcaster } from 'ngx-base';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Injectable } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Spaces, Contexts, Space, SpaceService } from 'ngx-fabric8-wit';

@Injectable()
export class SpacesService implements Spaces {

  static readonly RECENT_SPACE_LENGTH = 8;
  private static readonly RECENT_SPACE_KEY = 'recentSpaceIds';

  private _current: Observable<Space>;
  private _recent: ConnectableObservable<Space[]>;

  constructor(
    private contexts: Contexts,
    private localStorage: LocalStorageService,
    private spaceService: SpaceService,
    private broadcaster: Broadcaster
  ) {
    this._current = contexts.current
      .map(val => val.space);
    // Create the recent context list
    let addRecent: Subject<Space> = new Subject<Space>();

    this._recent = Observable.merge(
      this.broadcaster.on<Space>('spaceChanged'),
      addRecent)
      // Map from the context being added to an array of recent contexts
      // The scan operator allows us to access the list of recent contexts and add ours
      .scan((recent, s) => {
        // First, check if this context is already in the list
        // If it is, remove it, so we don't get duplicates
        for (let i = recent.length - 1; i >= 0; i--) {
          if (recent[i].id === s.id) {
            recent.splice(i, 1);
          }
        }
        // Then add this context to the top of the list
        recent.unshift(s);
        return recent;
        // The final value to scan is the initial value, used when the app starts
      },
      [])
      // Finally save the list of recent contexts
      .do(val => {
        // Truncate the number of recent contexts to the correct length
        if (val.length > SpacesService.RECENT_SPACE_LENGTH) {
          val.splice(
            SpacesService.RECENT_SPACE_LENGTH,
            val.length - SpacesService.RECENT_SPACE_LENGTH
          );
        }
      })
      .do(val => {
        this.saveRecent(val);
      })
      .multicast(() => new ReplaySubject(1));
    this._recent.connect();
    Observable.forkJoin(this.loadRecent()).subscribe(val => val.forEach(space => addRecent.next(space)));
  }

  get current(): Observable<Space> {
    return this._current;
  }

  get recent(): Observable<Space[]> {
    return this._recent;
  }

  private loadRecent(): Observable<Space>[] {
    let res: Space[] = [];
    if (this.localStorage.get(SpacesService.RECENT_SPACE_KEY)) {
      return this.localStorage
        .get<string[]>(SpacesService.RECENT_SPACE_KEY)
        // We invert the order above when we add recent contexts
        .reverse()
        .map(id => {
          return this.spaceService.getSpaceById(id);
        });
    } else {
      return [];
    }
  }

  private saveRecent(recent: Space[]) {
    this.localStorage.set(SpacesService.RECENT_SPACE_KEY, recent.map(val => val.id));
  }

}
