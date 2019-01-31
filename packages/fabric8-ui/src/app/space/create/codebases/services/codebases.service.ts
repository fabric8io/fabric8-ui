import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Codebase } from './codebase';

class Payload<T> {
  data: T;

  links: any;

  constructor(t: T) {
    this.data = t;
  }
}

@Injectable()
export class CodebasesService {
  private readonly headers: HttpHeaders;

  private readonly codebasesUrl: string;

  private readonly spacesUrl: string;

  private nextLink: string = null;

  constructor(
    private http: HttpClient,
    private logger: Logger,
    private auth: AuthenticationService,
    @Inject(WIT_API_URL) apiUrl: string,
  ) {
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.auth.getToken() != undefined) {
      headers = headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    this.headers = headers;
    this.spacesUrl = `${apiUrl}spaces`;
    this.codebasesUrl = `${apiUrl}codebases`;
  }

  /**
   * Add a codbase to the given space
   *
   * @param spaceId The ID associated with the given space
   * @param codebase The codebase to add
   * @returns {Observable<Codebase>}
   */
  addCodebase(spaceId: string, codebase: Codebase): Observable<Codebase> {
    const url: string = `${this.spacesUrl}/${spaceId}/codebases`;
    const payload: string = JSON.stringify(new Payload<Codebase>(codebase));
    return this.http.post<Payload<Codebase>>(url, payload, { headers: this.headers }).pipe(
      map((payload: Payload<Codebase>): Codebase => payload.data),
      catchError((error: HttpErrorResponse): Observable<Codebase> => this.handleError(error)),
    );
  }

  /**
   * Get the codebases associated with give space
   *
   * @param spaceId The ID associated with the given space
   * @returns {Observable<Codebase>}
   */
  getCodebases(spaceId: string): Observable<Codebase[]> {
    const url: string = `${this.spacesUrl}/${spaceId}/codebases`;
    return this.http.get<Payload<Codebase[]>>(url, { headers: this.headers }).pipe(
      map((payload: Payload<Codebase[]>): Codebase[] => payload.data),
      tap(
        (codebases: Codebase[]): void =>
          codebases.forEach(
            (codebase: Codebase): void => {
              codebase.name = this.getName(codebase);
              codebase.url = this.getUrl(codebase);
            },
          ),
      ),
      catchError((error: HttpErrorResponse): Observable<Codebase[]> => this.handleError(error)),
    );
  }

  /**
   * Get codebase pages associated with give space
   *
   * @param spaceId The ID associated with the given space
   * @param pageSize The page limit to retrieve (default is 20)
   * @returns {Observable<Codebase[]>}
   */
  getPagedCodebases(spaceId: string, pageSize: number = 20): Observable<Codebase[]> {
    const url: string = `${this.spacesUrl}/${spaceId}/codebases?page[limit]=${pageSize}`;
    return this.getCodebasesDelegate(url);
  }

  /**
   * Get more codebase pages associated with give space
   *
   * @returns {Observable<Codebase[]>}
   */
  getMoreCodebases(): Observable<Codebase[]> {
    if (this.nextLink) {
      return this.getCodebasesDelegate(this.nextLink);
    }
    return observableThrowError('No more codebases found');
  }

  /**
   * Update codebase
   *
   * @param codebase
   * @returns {Observable<Codebase>}
   */
  updateCodebases(codebase: Codebase): Observable<Codebase> {
    const url: string = `${this.codebasesUrl}/${codebase.id}`;
    const payload: string = JSON.stringify(new Payload<Codebase>(codebase));
    return this.http.patch<Payload<Codebase>>(url, payload, { headers: this.headers }).pipe(
      map((payload: Payload<Codebase>): Codebase => payload.data),
      catchError((error: HttpErrorResponse): Observable<Codebase> => this.handleError(error)),
    );
  }

  /**
   * Update codebase
   *
   * @param codebase
   * @returns {Observable<Codebase>}
   */
  update(codebase: Codebase): Observable<Codebase> {
    const url: string = `${this.spacesUrl}/${codebase.id}`;
    const payload: string = JSON.stringify({ data: codebase });
    return this.http.patch<Payload<Codebase>>(url, payload, { headers: this.headers }).pipe(
      map((payload: Payload<Codebase>): Codebase => payload.data),
      catchError((error: HttpErrorResponse): Observable<Codebase> => this.handleError(error)),
    );
  }

  /**
   * Delete codebase
   *
   * @param {Codebase} codebase codebase to delete
   * @returns {Observable<Codebase>}
   */
  deleteCodebase(codebase: Codebase): Observable<Codebase> {
    const url: string = `${this.codebasesUrl}/${codebase.id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      map((): Codebase => codebase),
      catchError((error: HttpErrorResponse): Observable<Codebase> => this.handleError(error)),
    );
  }

  // Private

  /**
   * Get the codebases associated with the given space
   *
   * @param url The URL used to retrieve paged codebases
   * @returns {Observable<Codebase[]>}
   */
  private getCodebasesDelegate(url: string): Observable<Codebase[]> {
    return this.http.get<Payload<Codebase[]>>(url, { headers: this.headers }).pipe(
      map((payload: Payload<Codebase[]>) => {
        // Extract links from JSON API response.
        // and set the nextLink, if server indicates more resources
        // in paginated collection through a 'next' link.
        const links: any = payload.links;
        if (links.hasOwnProperty('next')) {
          this.nextLink = links.next;
        } else {
          this.nextLink = null;
        }
        return payload.data;
      }),
      tap((codebases: Codebase[]) =>
        codebases.forEach((codebase: Codebase) => {
          codebase.name = this.getName(codebase);
          codebase.url = this.getUrl(codebase);
        }),
      ),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    this.logger.error(error);
    return observableThrowError(error.message || error);
  }

  private getName(codebase: Codebase): string {
    if (codebase.attributes.type === 'git') {
      return codebase.attributes.url.replace('.git', '').replace('git@github.com:', '');
    }
    return codebase.attributes.url;
  }

  private getUrl(codebase: Codebase): string {
    if (codebase.attributes.type === 'git') {
      return codebase.attributes.url
        .replace('.git', '')
        .replace(':', '/')
        .replace('git@', 'https://');
    }
    return codebase.attributes.url;
  }
}
