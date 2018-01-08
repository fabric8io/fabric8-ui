import { Injectable } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';
import { Broadcaster } from 'ngx-base';
import { Contexts, Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { Observable, Subject } from 'rxjs';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ExtProfile, ProfileService } from '../profile/profile.service';

@Injectable()
export class SpacesService implements Spaces {

  static readonly RECENT_SPACE_LENGTH = 8;
  private static readonly RECENT_SPACE_KEY = 'recentSpaceIds';

  addRecent: Subject<Space> = new Subject<Space>();
  private _current: Observable<Space>;
  private _recent: ConnectableObservable<Space[]>;

  constructor(
    private contexts: Contexts,
    private localStorage: LocalStorageService,
    private spaceService: SpaceService,
    private broadcaster: Broadcaster,
    private profileService: ProfileService
  ) {
    this._current = Observable.merge(
      contexts.current
        .map(val => val.space),
      this.broadcaster.on<Space>('spaceUpdated'));
    // Create the recent context list

    this._recent = Observable.merge(
      this.broadcaster.on<Space>('spaceChanged'),
      this.addRecent)
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
    this.loadRecent().subscribe(val => val.forEach(space => this.addRecent.next(space)));
  }

  get current(): Observable<Space> {
    return this._current;
  }

  get recent(): Observable<Space[]> {
    return this._recent;
  }

  private loadRecent(): Observable<Space[]> {
    return this.profileService.current.switchMap(profile => {
      if (profile.store.recentSpaces) {
        return Observable.forkJoin((profile.store.recentSpaces as string[])
          // We invert the order above when we add recent contexts
          .reverse()
          .map(id => {
            return this.spaceService.getSpaceById(id);
          }));
      } else {
        return Observable.of([]);
      }
    });
  }

  private saveRecent(recent: Space[]) {
    let patch = {
      store: {
        recentSpaces: recent.map(val => val.id)
      }
    } as ExtProfile;
    return this.profileService.silentSave(patch)
      .subscribe(profile => { }, err => console.log('Error saving recent spaces:', err));
  }

}
