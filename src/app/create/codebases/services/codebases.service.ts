import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { UserService } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { Observable } from 'rxjs';

import { Codebase } from './codebase';
import {ApiLocatorService} from "../../../shared/api-locator.service";
import {pathJoin} from "fabric8-runtime-console/src/app/kubernetes/model/utils";
import {AuthenticationService} from "../../../shared/authentication.service";

@Injectable()
export class CodebasesService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private nextLink: string = null;

  constructor(
      private http: Http,
      private logger: Logger,
      private apiLocator: ApiLocatorService,
      private auth: AuthenticationService) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
  }

  protected get apiUrl(): string {
    return this.apiLocator.witApiUrl;
  }

  protected get spacesUrl(): string {
    return pathJoin(this.apiUrl, 'spaces');
  }


  /**
   * Add a codbase to the given space
   *
   * @param spaceId The ID associated with the given space
   * @param codebase The codebase to add
   * @returns {Observable<Codebase>}
   */
  addCodebase(spaceId: string, codebase: Codebase): Observable<Codebase> {
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

  /**
   * Get the codebases associated with give space
   *
   * @param spaceId The ID associated with the given space
   * @returns {Observable<Codebase>}
   */
  getCodebases(spaceId: string): Observable<Codebase[]> {
    let url = `${this.spacesUrl}/${spaceId}/codebases`;
    return this.http.get(url, { headers: this.headers })
      .map((response) => {
        return response.json().data as Codebase[];
      })
      .do(codebases => codebases.forEach(codebase => {
        codebase.name = this.getName(codebase);
        codebase.url = this.getUrl(codebase);
      }))
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Get codebase pages associated with give space
   *
   * @param spaceId The ID associated with the given space
   * @param pageSize The page limit to retrieve (default is 20)
   * @returns {Observable<Codebase[]>}
   */
  getPagedCodebases(spaceId: string, pageSize: number = 20): Observable<Codebase[]> {
    let url = `${this.spacesUrl}/${spaceId}/codebases` + '?page[limit]=' + pageSize;
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
    } else {
      return Observable.throw('No more codebases found');
    }
  }

  /**
   * Update codebase
   *
   * @param codebase
   * @returns {Observable<Codebase>}
   */
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

  // Private

  /**
   * Get the codebases associated with the given space
   *
   * @param url The URL used to retrieve paged codebases
   * @returns {Observable<Codebase[]>}
   */
  private getCodebasesDelegate(url: string): Observable<Codebase[]> {
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
        return response.json().data as Codebase[];
      })
      .do(codebases => codebases.forEach(codebase => {
        codebase.name = this.getName(codebase);
        codebase.url = this.getUrl(codebase);
      }))
      .catch((error) => {
        return this.handleError(error);
      });
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }


  private getName(codebase: Codebase): string {
    if (codebase.attributes.type === 'git') {
      return codebase.attributes.url.replace('.git', '').replace('git@github.com:', '');
    } else {
      return codebase.attributes.url;
    }
  }

  private getUrl(codebase: Codebase): string {
    if (codebase.attributes.type === 'git') {
      return codebase.attributes.url.replace('.git', '').replace(':', '/').replace('git@', 'https://');
    } else {
      return codebase.attributes.url;
    }
  }

}
