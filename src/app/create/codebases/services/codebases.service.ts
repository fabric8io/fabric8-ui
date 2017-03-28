import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { Observable } from 'rxjs';

import { WIT_API_URL } from 'ngx-fabric8-wit';
import { Codebase } from './codebase';

@Injectable()
export class CodebasesService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private spacesUrl: string;
  private nextLink: string = null;

  constructor(
    private http: Http,
    private logger: Logger,
    private auth: AuthenticationService,
    private userService: UserService,
    @Inject(WIT_API_URL) apiUrl: string) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.spacesUrl = apiUrl + 'spaces';
  }

  getCodebases(spaceId: string): Observable<Codebase[]> {
    let url = `${this.spacesUrl}/${spaceId}/codebases`;
    return this.http.get(url, { headers: this.headers })
        .map((response) => {
          return response.json().data as Codebase;
        })
        .catch((error) => {
          return this.handleError(error);
        });
  }

  getCodebasesPaged(spaceId: string, pageSize: number = 20): Observable<Codebase[]> {
    let url = `${this.spacesUrl}/${spaceId}/codebases` + '?page[limit]=' + pageSize;
    return this.getCodebasesDelegate(url, true);
  }

  getCodebasesDelegate(url: string, isAll: boolean): Observable<Codebase[]> {
    return this.http
      .get(url, { headers: this.headers })
      .map(response => {
        // Extract links from JSON API response.
        // and set the nextLink, if server indicates more resources
        // in paginated collection through a 'next' link.
        let links = response.json().links;
        if (links.hasOwnProperty('next')) {
          this.nextLink = links.next;
        } else {
          this.nextLink = null;
        }
        // Extract data from JSON API response, and assert to an array of spaces.
        let newCodebases: Codebase[] = response.json().data as Codebase[];
        return newCodebases;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  getMoreCodebases(): Observable<Codebase[]> {
    if (this.nextLink) {
      return this.getCodebasesDelegate(this.nextLink, false);
    } else {
      return Observable.throw('No more codebases found');
    }
  }

  create(spaceId: string, codebase: Codebase): Observable<Codebase> {
    let url = `${this.spacesUrl}/${spaceId}/codebases`;
    let payload = JSON.stringify({ data: codebase });
    return this.http
        .post(url, payload, { headers: this.headers })
        .map(response => {
          return response.json().data as Codebase;
        })
        .catch((error) => {
          return this.handleError(error);
        });
  }

  update(codebase: Codebase): Observable<Codebase> {
    let url = `${this.spacesUrl}/${codebase.id}`;
    let payload = JSON.stringify({ data: codebase });
    return this.http
        .patch(url, payload, { headers: this.headers })
        .map(response => {
          return response.json().data as Codebase;
        })
        .catch((error) => {
          return this.handleError(error);
        });
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }
}
