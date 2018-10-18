import { Injectable } from '@angular/core';

import {
  Observable,
  of
} from 'rxjs';
import {
  catchError,
  concatMap,
  map
} from 'rxjs/operators';

import {
  CollaboratorService,
  Space
} from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';

@Injectable()
export class MySpacesItemService {

  constructor(
    private readonly collaboratorService: CollaboratorService
  ) { }

  getCollaboratorCount(space: Space): Observable<number> {
    return this.collaboratorService.getInitialBySpaceId(space.id)
      .pipe(
        map((users: User[]): number => users.length),
        concatMap((count: number): Observable<number> => this.loadFurtherCollaborators(count))
      );
  }

  // TODO: replace these cascading requests with a single request returning the meta totalCount property
  // of the response
  private loadFurtherCollaborators(accum: number): Observable<number> {
    return this.collaboratorService.getNextCollaborators()
      .pipe(
        map((users: User[]): number => users.length),
        concatMap((count: number): Observable<number> => this.loadFurtherCollaborators(accum + count)),
        catchError(() => of(accum))
      );
  }

}
