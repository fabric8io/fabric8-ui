import { Injectable } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { Contexts, Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { ExtProfile, ProfileService } from '../profile/profile.service';

@Injectable()
export class SpacesService implements Spaces {

  static readonly RECENT_SPACE_LENGTH = 8;

  private _current: Observable<Space>;
  private _recent: Subject<Space[]>;

  constructor(
    private contexts: Contexts,
    private spaceService: SpaceService,
    private broadcaster: Broadcaster,
    private profileService: ProfileService
  ) {
    this._recent = new ReplaySubject<Space[]>(1);
    this.initCurrent();
    this.initRecent();
  }

  private initCurrent(): void {
    this._current = merge(
      this.contexts.current.pipe(
        map(val => val.space)
      ),
      this.broadcaster.on<Space>('spaceUpdated')
    );
  }

  private initRecent(): void {
    // load existing recent spaces from profile.store.recentSpaces
    this.loadRecent().subscribe((spaces: Space[]): void => {
      this._recent.next(spaces);
    });

    // update _recent with newly seen space when spaceChanged is emitted
    this.broadcaster.on<Space>('spaceChanged')
      .pipe(
        withLatestFrom(this.recent),
        map(([changedSpace, recentSpaces]: [Space, Space[]]): [Space, Space[], number] => {
          let index: number = recentSpaces.findIndex((space: Space): boolean => space.id === changedSpace.id);
          return [changedSpace, recentSpaces, index];
        }),
        filter(([changedSpace, recentSpaces, index]: [Space, Space[], number]): boolean => {
          return index !== 0; // continue only if the changed space is new, or requires a move in _recent
        }),
        map(([changedSpace, recentSpaces, index]: [Space, Space[], number]): Space[] => {
          // if changedSpace exists in recentSpaces
          if (index !== -1) {
            // move the space to the front of the list if it is already in _recent
            if (recentSpaces[0].id !== changedSpace.id) {
              recentSpaces.splice(index, 1);
              recentSpaces.unshift(changedSpace);
            }
            // otherwise, no operation required; changedSpace is already index 0
          // if changedSpace is new to the recent spaces
          } else {
            recentSpaces.unshift(changedSpace);
            // trim recentSpaces if required to ensure it is length =< 8
            if (recentSpaces.length > SpacesService.RECENT_SPACE_LENGTH) {
              recentSpaces.pop();
            }
          }
          return recentSpaces;
        })
      )
      .subscribe((recentSpaces: Space[]): void => {
        this.saveRecent(recentSpaces);
      });

    // if a space is deleted, check to see if it should be removed from _recent
    this.broadcaster.on<Space>('spaceDeleted')
      .pipe(
        withLatestFrom(this.recent),
        map(([deletedSpace, recentSpaces]: [Space, Space[]]): [Space, Space[], number] => {
          let index: number = recentSpaces.findIndex((space: Space): boolean => space.id === deletedSpace.id);
          return [deletedSpace, recentSpaces, index];
        }),
        filter(([deletedSpace, recentSpaces, index]: [Space, Space[], number]): boolean => {
          return index !== -1;
        }),
        map(([deletedSpace, recentSpaces, index]: [Space, Space[], number]): Space[] => {
          recentSpaces.splice(index, 1);
          return recentSpaces;
        })
      )
      .subscribe((recentSpaces: Space[]): void => {
        this.saveRecent(recentSpaces);
      });
  }

  get current(): Observable<Space> {
    return this._current;
  }

  get recent(): Observable<Space[]> {
    return this._recent;
  }

  private loadRecent(): Observable<Space[]> {
    return this.profileService.current.switchMap((profile: ExtProfile): Observable<Space[]> => {
      if (profile.store.recentSpaces) {
        return forkJoin((profile.store.recentSpaces as string[]).map((id: string): Observable<Space> => {
          // if getSpaceById() throws an error, forkJoin will not complete and loadRecent will not return
          return this.spaceService.getSpaceById(id).catch((): Observable<Space> => Observable.of(null));
        }))
        .map((spaces: Space[]): Space[] => {
          return spaces.filter(((space: Space): boolean => { return space !== null; }));
        });
      } else {
        return of([]);
      }
    });
  }

  private saveRecent(recent: Space[]): Subscription {
    this._recent.next(recent);
    let patch = {
      store: {
        recentSpaces: recent.map((val: Space): string => val.id)
      }
    } as ExtProfile;
    return this.profileService.silentSave(patch)
      .subscribe((): void => {}, (err: string): void => console.log('Error saving recent spaces:', err));
  }

}
