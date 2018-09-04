import { Injectable } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { Contexts, Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { ExtProfile, ProfileService } from '../profile/profile.service';

@Injectable()
export class SpacesService implements Spaces {

  static readonly RECENT_SPACE_LENGTH = 8;

  private _current: Observable<Space>;
  private _recent: ReplaySubject<Space[]> = new ReplaySubject<Space[]>(1);
  private recentChanged: boolean = false;

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
      this._recent.next(spaces);
    });

    // update _recent with newly seen space when spaceChanged is emitted
    this.broadcaster.on<Space>('spaceChanged')
      .flatMap((changedSpace: Space) => {
        return this._recent.first().map((recentSpaces: Space[]) => {
          let index: number = this.findRecentIndexById(recentSpaces, changedSpace.id);
          // if changedSpace exists in _recent
          if (index !== -1) {
            // move the space to the front of the list if it is already in _recent
            if (recentSpaces[0].id !== changedSpace.id) {
              recentSpaces.splice(index, 1);
              recentSpaces.unshift(changedSpace);
              this.recentChanged = true;
            }
            // otherwise, no operation required; changedSpace is already index 0
          // if changedSpace is new to the recent spaces
          } else {
            recentSpaces.unshift(changedSpace);
            // trim _recent if required to ensure it is length =< 8
            if (recentSpaces.length > SpacesService.RECENT_SPACE_LENGTH) {
              recentSpaces.pop();
            }
            this.recentChanged = true;
          }
          return recentSpaces;
        });
      })
      .subscribe((recentSpaces: Space[]) => {
        if (this.recentChanged) {
          this.saveRecent(recentSpaces);
        }
      });

    // if a space is deleted, check to see if it should be removed from _recent
    this.broadcaster.on<Space>('spaceDeleted')
      .flatMap((deletedSpace: Space) => {
        return this._recent.first().map((recentSpaces: Space[]) => {
          let index: number = this.findRecentIndexById(recentSpaces, deletedSpace.id);
          if (index !== -1) {
            recentSpaces.splice(index, 1);
            this.recentChanged = true;
          }
          return recentSpaces;
        });
      })
      .subscribe((recentSpaces: Space[]) => {
        if (this.recentChanged) {
          this.saveRecent(recentSpaces);
        }
      });
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
          .map(id => {
            return this.spaceService.getSpaceById(id);
          }));
      } else {
        return Observable.of([]);
      }
    });
  }

  private saveRecent(recent: Space[]): Subscription {
    this._recent.next(recent);
    this.recentChanged = false;
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
  findRecentIndexById(spaces: Space[], id: string): number {
    return spaces.findIndex(space => space.id === id);
  }

}
