import { ErrorHandler } from '@angular/core';
import { Context, Space } from 'ngx-fabric8-wit';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ExtProfile, ProfileService } from '../profile/profile.service';

export const RECENT_LENGTH: number = 8;

export interface RecentData <T extends Context | Space> {
  data: T[];
  isSaveRequired: boolean;
}

export function isContext(context: any): context is Context {
  return (<Context> context.user !== undefined);
}

export function isSpace(space: any): space is Space {
  return (<Space> space.id !== undefined);
}

export abstract class RecentUtils <T extends Context | Space> {

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

  onBroadcastChanged(changed: T, recent: T[]): RecentData<T> {
    let index: number = 0;
    if (isContext(changed)) {
      index = (recent as Context[]).findIndex((context: Context) => context.name === (changed as Context).name);
    } else if (isSpace(changed)) {
      index = (recent as Space[]).findIndex((space: Space): boolean => space.id === (changed as Space).id);
    }

    if (index === 0) { // continue only if changed is new, or requires a move within recent
      return { data: recent, isSaveRequired: false } as RecentData<T>;
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
    return { data: recent, isSaveRequired: true } as RecentData<T>;
  }

  onBroadcastDeleted(deletedSpace: Space, recent: T[]): RecentData<T> {
    let index: number = -1;
    if (recent.length !== 0 && isContext(recent[0])) {
      index = (recent as Context[]).findIndex((context: Context): boolean => {
        if (context.space) {
          return context.space.id === deletedSpace.id;
        } else {
          return false;
        }
      });
    } else if (recent.length !== 0 && isSpace(recent[0])) {
      index = (recent as Space[]).findIndex((space: Space): boolean => space.id === deletedSpace.id);
    }

    if (index === -1) {
      return { data: recent, isSaveRequired: false } as RecentData<T>;
    }
    recent.splice(index, 1);
    return { data: recent, isSaveRequired: true } as RecentData<T>;
  }

  saveProfile(patch: ExtProfile): void {
    this.profileService.silentSave(patch).subscribe(
      (): void => {},
      (err: string): void => {
        this.errorHandler.handleError(err);
      });
  }

}
