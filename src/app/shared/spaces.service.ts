import { ErrorHandler } from '@angular/core';
import { Injectable } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { Contexts, Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { Observable, Subscription } from 'rxjs';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { ExtProfile, ProfileService } from '../profile/profile.service';
import { RecentData, RecentUtils } from './recent-utils';

@Injectable()
export class SpacesService extends RecentUtils<Space> implements Spaces {

  private _current: Observable<Space>;
  private subscriptions: Subscription[] = [];

  constructor(
    protected errorHandler: ErrorHandler,
    protected profileService: ProfileService,
    private broadcaster: Broadcaster,
    private spaceService: SpaceService,
    private contexts: Contexts
  ) {
    super(errorHandler, profileService);
    this.initCurrent();
    this.initRecent();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => {
      subscription.unsubscribe();
    });
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
    this.subscriptions.push(
      this.loadRecentSpaces().subscribe((spaces: Space[]): void => {
        this._recent.next(spaces);
      })
    );

    this.subscriptions.push(
      this.broadcaster.on<Space>('spaceChanged')
        .pipe(
          withLatestFrom(this.recent),
          map(([changedSpace, recentSpaces]: [Space, Space[]]): RecentData<Space> => {
            return this.onBroadcastChanged(changedSpace, recentSpaces);
          }),
          filter((recentData: RecentData<Space>): boolean => recentData.isSaveRequired === true)
        )
        .subscribe((recentData: RecentData<Space>): void => {
          this.saveRecentSpaces(recentData.data);
        })
    );

    this.subscriptions.push(
      this.broadcaster.on<Space>('spaceDeleted')
        .pipe(
          withLatestFrom(this.recent),
          map(([deletedSpace, recentSpaces]): RecentData<Space> => {
            return this.onBroadcastDeleted(deletedSpace, recentSpaces);
          }),
          filter((recentData: RecentData<Space>) => recentData.isSaveRequired === true)
        )
        .subscribe((recentData: RecentData<Space>): void => {
          this.saveRecentSpaces(recentData.data);
        })
    );
  }

  get current(): Observable<Space> {
    return this._current;
  }

  private loadRecentSpaces(): Observable<Space[]> {
    return this.profileService.current.switchMap((profile: ExtProfile): Observable<Space[]> => {
      if (profile.store.recentSpaces && profile.store.recentSpaces.length > 0) {
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

  private saveRecentSpaces(recentSpaces: Space[]): void {
    this._recent.next(recentSpaces);
    let patch: ExtProfile = {
      store: {
        recentSpaces: (recentSpaces as Space[]).map((val: Space): string => val.id)
      }
    } as ExtProfile;
    this.saveProfile(patch);
  }

}
