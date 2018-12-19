import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, zip } from 'rxjs/operators';

import { Logger } from 'ngx-base';
import { Space, SpaceService, WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

export interface UserSpacesResponse {
  data: SpaceInformation[];
  meta: {
    totalCount: number;
  };
}

export class SpaceInformation {
  attributes: {
    name: string;
  };
  id: string;
  links: {
    self: string;
  };
  type: string;
}

@Injectable()
export class UserSpacesService {
  private readonly headers: HttpHeaders = new HttpHeaders();

  constructor(
    private readonly http: HttpClient,
    @Inject(WIT_API_URL) private readonly witUrl: string,
    private readonly auth: AuthenticationService,
    private readonly errorHandler: ErrorHandler,
    private readonly logger: Logger,
    private readonly spaceService: SpaceService,
  ) {}

  private getUserSpacesResponse(): Observable<UserSpacesResponse> {
    let headers: HttpHeaders = this.headers;
    if (this.auth.getToken() != null) {
      headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    return this.http
      .get(`${this.witUrl}user/spaces`, { headers })
      .pipe(map((response: UserSpacesResponse) => response));
  }

  getInvolvedSpacesCount(): Observable<number> {
    return this.getUserSpacesResponse().pipe(
      map((response: UserSpacesResponse) => response.meta.totalCount),
      catchError(
        (err: HttpErrorResponse): Observable<number> => {
          this.errorHandler.handleError(err);
          this.logger.error(err);
          return of(0);
        },
      ),
    );
  }

  // Currently the backend returns values that look like Space[], but isn't
  getInvolvedSpaces(): Observable<SpaceInformation[]> {
    return this.getUserSpacesResponse().pipe(
      map((response: UserSpacesResponse): SpaceInformation[] => response.data),
      catchError(
        (err: HttpErrorResponse): Observable<Space[]> => {
          this.errorHandler.handleError(err);
          this.logger.error(err);
          return of([]);
        },
      ),
    );
  }

  // returns a list of spaces the user is a collaborator on
  getSharedSpaces(username: string, pageSize: number = 20): Observable<Space[]> {
    return this.spaceService.getSpacesByUser(username, pageSize).pipe(
      zip(this.getInvolvedSpaces()),
      map(
        ([ownedSpaces, involvedSpaces]: [Space[], SpaceInformation[]]): string[] => {
          let involvedSpaceIds: string[] = involvedSpaces.map(
            (space: SpaceInformation): string => space.id,
          );
          let ownedSpaceIds: string[] = ownedSpaces.map((space: Space): string => space.id);
          return involvedSpaceIds.filter((id: string) => ownedSpaceIds.indexOf(id) < 0);
        },
      ),
      filter((ids: string[]): boolean => ids.length > 0),
      switchMap(
        (ids: string[]): Observable<Space[]> =>
          forkJoin(ids.map((id: string): Observable<Space> => this.spaceService.getSpaceById(id))),
      ),
    );
  }
}
