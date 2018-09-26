import { ErrorHandler } from '@angular/core';
import { Space } from 'ngx-fabric8-wit';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ExtProfile, ProfileService } from '../profile/profile.service';

export const RECENT_LENGTH: number = 8;

export interface RecentData <T> {
  recent: T[];
  isSaveRequired: boolean;
}

export abstract class RecentUtils<T> {

  protected _recent: Subject<T[]>;

  constructor(
    protected errorHandler: ErrorHandler,
    protected profileService: ProfileService
  ) {
    this._recent = new ReplaySubject<T[]>(1);
  }

  get recent(): Observable<T[]> {
    return this._recent;
  }

  abstract compareElements<T>(t1: T, t2: T);

  onBroadcastChanged(changed: T, recent: T[], compareFn: Function = this.compareElements): RecentData<T> {
    let index: number = recent.findIndex((t: T) => compareFn(t, changed));
    if (index === 0) { // continue only if changed is new, or requires a move within recent
      return { recent: recent, isSaveRequired: false };
    } else if (index > 0) { // if changed exists in recent, move it to the front
      recent.splice(index, 1);
      recent.unshift(changed);
    } else { // if changed is new to recent
      recent.unshift(changed);
      // trim recent if required to ensure it is length =< 8
      if (recent.length > RECENT_LENGTH) {
        recent.pop();
      }
    }
    return { recent: recent, isSaveRequired: true };
  }

  onBroadcastSpaceDeleted(deletedSpace: Space, recent: T[], compareFn: Function = this.compareElements): RecentData<T> {
    let index: number = recent.findIndex((t: T) => compareFn(t, deletedSpace));
    if (index === -1) {
      return { recent: recent, isSaveRequired: false };
    }
    recent.splice(index, 1);
    return { recent: recent, isSaveRequired: true };
  }

  saveProfile(patch: ExtProfile): void {
    this.profileService.silentSave(patch).subscribe(
      (): void => {},
      (err: string): void => {
        this.errorHandler.handleError(err);
      });
  }

}
