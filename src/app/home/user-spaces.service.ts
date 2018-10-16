import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import {
  ErrorHandler,
  Inject,
  Injectable
} from '@angular/core';
import {
  Observable,
  of
} from 'rxjs';
import {
  catchError,
  map
} from 'rxjs/operators';

import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

export interface UserSpacesResponse {
  data: Object[];
  meta: {
    totalCount: number
  };
}

@Injectable()
export class UserSpacesService {

  private readonly headers: HttpHeaders = new HttpHeaders();

  constructor(
    private readonly http: HttpClient,
    @Inject(WIT_API_URL) private readonly witUrl: string,
    private readonly auth: AuthenticationService,
    private readonly errorHandler: ErrorHandler,
    private readonly logger: Logger
  ) { }

  getInvolvedSpacesCount(): Observable<number> {
    let headers: HttpHeaders = this.headers;
    if (this.auth.getToken() != null) {
      headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    return this.http.get(`${this.witUrl}user/spaces`, { headers })
      .pipe(
        map((response: UserSpacesResponse) => response.meta.totalCount),
        catchError((err: HttpErrorResponse): Observable<number> => {
          this.errorHandler.handleError(err);
          this.logger.error(err);
          return of(0);
        })
      );
  }

}
