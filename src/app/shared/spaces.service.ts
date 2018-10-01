import { ErrorHandler } from '@angular/core';
import { Injectable } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { Contexts, Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { forkJoin, merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
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
      this.loadRecentSpaces().subscribe((spaces: Space[]): void =>
        this._recent.next(spaces)
      )
    );

    this.subscriptions.push(
      this.broadcaster.on<Space>('spaceChanged')
        .pipe(
          withLatestFrom(this.recent),
          map(([changedSpace, recentSpaces]: [Space, Space[]]): RecentData<Space> =>
            this.onBroadcastChanged(changedSpace, recentSpaces)
          ),
          filter((recentData: RecentData<Space>): boolean => recentData.isSaveRequired)
        )
        .subscribe((recentData: RecentData<Space>): void =>
          this.saveRecentSpaces(recentData.recent)
        )
    );

    this.subscriptions.push(
      this.broadcaster.on<Space>('spaceDeleted')
        .pipe(
          withLatestFrom(this.recent),
          map(([deletedSpace, recentSpaces]): RecentData<Space> =>
            this.onBroadcastSpaceDeleted(deletedSpace, recentSpaces)
          ),
          filter((recentData: RecentData<Space>) => recentData.isSaveRequired)
        )
        .subscribe((recentData: RecentData<Space>): void =>
          this.saveRecentSpaces(recentData.recent)
        )
    );
  }

  // implements recent-utils compareElements()
  compareElements(s1: Space, s2: Space): boolean {
    return s1.id === s2.id;
  }

  get current(): Observable<Space> {
    return this._current;
  }

  private loadRecentSpaces(): Observable<Space[]> {
    return this.profileService.current.pipe(switchMap((profile: ExtProfile): Observable<Space[]> => {
      if (profile.store.recentSpaces && profile.store.recentSpaces.length > 0) {
        return forkJoin((profile.store.recentSpaces as string[]).map((id: string): Observable<Space> => {
          // if getSpaceById() throws an error, forkJoin will not complete and loadRecent will not return
          return this.spaceService.getSpaceById(id).pipe(catchError((): Observable<Space> => observableOf(null)));
        })).pipe(
        map((spaces: Space[]): Space[] => {
          return spaces.filter((space: Space): boolean => space !== null);
        }));
      } else {
        return observableOf([]);
      }
    }));
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
