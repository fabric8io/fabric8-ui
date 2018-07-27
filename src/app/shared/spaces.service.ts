import { Injectable } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { Contexts, Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { ExtProfile, ProfileService } from '../profile/profile.service';

@Injectable()
export class SpacesService implements Spaces {

  static readonly RECENT_SPACE_LENGTH = 8;

  private _current: Observable<Space>;
  private _recent: Space[] = [];

  constructor(
    private contexts: Contexts,
    private spaceService: SpaceService,
    private broadcaster: Broadcaster,
    private profileService: ProfileService
  ) {
    this.initCurrent();
    this.initRecent();
  }

  private initCurrent(): void {
    this._current = Observable.merge(
      this.contexts.current.map(val => val.space),
      this.broadcaster.on<Space>('spaceUpdated')
    );
  }

  private initRecent(): void {
    // load existing recent spaces from profile.store.recentSpaces
    this.loadRecent().subscribe(spaces => {
      spaces.forEach(space => {
        this._recent.push(space);
      });
    });

    // update _recent with newly seen space when spaceChanged is emitted
    this.broadcaster.on<Space>('spaceChanged').subscribe(space => {
      let index: number = this.findRecentIndexById(space.id);
      // if changedSpace exists in _recent
      if (index !== -1) {
        // move the space to the front of the list if it is already in _recent
        if (this._recent[0].id !== space.id) {
          this._recent.splice(index, 1);
          this._recent.unshift(space);
        }
        // otherwise, no operation required, changedSpace is already index 0
      } else {
        this._recent.unshift(space);
        // trim _recent if required to ensure it's length =< 8
        if (this._recent.length > SpacesService.RECENT_SPACE_LENGTH) {
          this._recent.pop();
        }
      }
      // update the profile's store.recentSpaces attribute
      this.saveRecent(this._recent);
    });

    // if a space is deleted, check to see if it should be removed from _recent
    this.broadcaster.on<Space>('spaceDeleted').subscribe(space => {
      let index: number = this.findRecentIndexById(space.id);
      if (index !== -1) {
        this._recent.splice(index, 1);
        this.saveRecent(this._recent);
      }
    });
  }

  get current(): Observable<Space> {
    return this._current;
  }

  get recent(): Observable<Space[]> {
    return Observable.of(this._recent);
  }

  private loadRecent(): Observable<Space[]> {
    return this.profileService.current.switchMap(profile => {
      if (profile.store.recentSpaces) {
        return Observable.forkJoin((profile.store.recentSpaces as string[])
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
      .subscribe(() => {}, err => console.log('Error saving recent spaces:', err));
  }

  /**
   * Given the id of a space, returns the index of the space in _recent
   */
  findRecentIndexById(id: string): number {
    for (let i: number = 0; i < this._recent.length; i++) {
      if (this._recent[i].id === id) {
        return i;
      }
    }
    return -1;
  }

}
