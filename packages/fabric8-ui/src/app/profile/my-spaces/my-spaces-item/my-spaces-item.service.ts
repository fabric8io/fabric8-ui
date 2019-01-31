import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { WorkItem } from 'fabric8-planner';
import { Logger } from 'ngx-base';
import { CollaboratorService, Space, WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

export interface WorkItemsResponse {
  data: WorkItem[];
  links: {
    first?: string;
    last?: string;
    next?: string;
  };
  meta: {
    totalCount: number;
    ancestorIDs: string[];
  };
  included: WorkItem[];
}

// hardcode this query URL to avoid pulling in large Planner module dependencies simply to construct a query string.
// TODO: ask Planner to export their query builder such that it can be used without importing UI component modules,
// or importing the query builder along with Planner's own HttpClient implementation. And to remove the Router logic
// from the query builder.
export function workItemsQueryString(space: Space): string {
  return `page[limit]=200&filter[expression]={"$AND":[{"state":{"$NE":"closed"}},{"state":{"$NE":"Done"}},{"state":{"$NE":"Removed"}},{"state":{"$NE":"Closed"}},{"space":{"$EQ":"${
    space.id
  }"}}]}`;
}

@Injectable()
export class MySpacesItemService {
  private headers: HttpHeaders = new HttpHeaders();

  constructor(
    @Inject(WIT_API_URL) private readonly apiUrl: string,
    private readonly collaboratorService: CollaboratorService,
    private readonly http: HttpClient,
    private readonly auth: AuthenticationService,
    private readonly errorHandler: ErrorHandler,
    private readonly logger: Logger,
  ) {
    if (this.auth.getToken() != null) {
      this.headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
  }

  getCollaboratorCount(space: Space): Observable<number> {
    return this.collaboratorService.getInitialBySpaceId(space.id).pipe(
      concatMap((): Observable<number> => this.collaboratorService.getTotalCount()),
      catchError((err: any): Observable<number> => this.handleError(err)),
    );
  }

  getWorkItemCount(space: Space): Observable<number> {
    const workItemUrl: string = `${this.apiUrl}search`;
    const queryUrl: string = `${workItemUrl}?${workItemsQueryString(space)}`;
    return this.http.get<WorkItemsResponse>(queryUrl, { headers: this.headers }).pipe(
      map((resp: WorkItemsResponse): number => resp.meta.totalCount),
      catchError((err: any): Observable<number> => this.handleError(err)),
    );
  }

  private handleError(err: any): Observable<number> {
    this.errorHandler.handleError(err);
    this.logger.error(err);
    return of(0);
  }
}
