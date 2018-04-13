import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  RequestOptions,
  Response
} from '@angular/http';

import { Observable } from 'rxjs';

import {
  Context
} from 'ngx-fabric8-wit';
import {
  HelperService,
  ProjectSummaryService,
  Summary,
  TokenProvider
} from 'ngx-forge';

import { ContextService } from 'app/shared/context.service';

@Injectable()
export class AppLauncherProjectSummaryService implements ProjectSummaryService {

  // TODO: remove the hardcodes
  private END_POINT: string = '';
  private API_BASE_CREATE: string = 'osio/launch';
  private API_BASE_IMPORT: string = 'osio/import';
  private ORIGIN: string = '';

  constructor(
    private http: Http,
    private context: ContextService,
    private helperService: HelperService,
    private tokenProvider: TokenProvider
  ) {
    if (this.helperService) {
      this.END_POINT = this.helperService.getBackendUrl();
      this.ORIGIN = this.helperService.getOrigin();
    }
  }

  /**
   * Set up the project for the given summary
   *
   * @param  {Summary} summary
   * @param  {string} spaceId
   * @param  {string} spaceName
   * @param  {boolean} isImport
   * @returns Observable
   */
  setup(summary: Summary, spaceId: string, spaceName: string, isImport: boolean): Observable<any> {
    let summaryEndPoint = '';
    let payload = '';
    if (isImport) {
      summaryEndPoint = this.END_POINT + this.API_BASE_IMPORT;
      payload = this.getImportPayload(summary, spaceId, spaceName);
    } else {
      summaryEndPoint = this.END_POINT + this.API_BASE_CREATE;
      payload = this.getCreatePayload(summary, spaceId, spaceName);
    }
    return this.options.flatMap((option) => {
      return this.http.post(summaryEndPoint, payload, option)
        .map(response => {
          if (response) {
            return response.json();
          }
        })
        .catch(this.handleError);
    });
  }

  /**
   * Get the current context details
   *
   * @returns {Observable<Context>}
   */
  getCurrentContext(): Observable<Context> {
    if (this.context) {
      return this.context.current;
    } else {
      return Observable.of(<Context> {});
    }
  }

  private get options(): Observable<RequestOptions> {
    let headers = new Headers();
    headers.append('X-App', this.ORIGIN);
    headers.append('X-Git-Provider', 'GitHub');
    headers.append('X-Execution-Step-Index', '0');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    if (this.tokenProvider) {
      return Observable.fromPromise(this.tokenProvider.token.then((token) => {
        headers.append('Authorization', 'Bearer ' + token);
        return new RequestOptions({
          headers: headers
        });
      }));
    } else {
      return Observable.of(
        new RequestOptions({
          headers: headers
        }));
    }
  }

  private handleError(error: Response | any) {
    let errMsg: string = '';
    if (error instanceof Response) {
      if (error.status !== 401) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  private getCreatePayload(summary: Summary, spaceId: string, spaceName: string) {
    let payload = '';
    if (summary && summary.mission && summary.runtime && summary.pipeline
      && summary.dependencyCheck && summary.gitHubDetails && summary.runtime.version) {
      payload =
      'mission=' + summary.mission.id +
      '&runtime=' + summary.runtime.id +
      '&runtimeVersion=' + summary.runtime.version.id +
      '&pipeline=' + summary.pipeline.id +
      '&projectName=' + summary.dependencyCheck.projectName +
      '&projectVersion=' + summary.dependencyCheck.projectVersion +
      '&groupId=' + summary.dependencyCheck.groupId +
      /* artifactId has to be same as projectName in OSIO to get correct links for
       stage/prod to be shown in pipelines view */
      '&artifactId=' + summary.dependencyCheck.projectName +
      '&spacePath=' + spaceName +
      '&gitRepository=' + summary.gitHubDetails.repository +
      '&space=' + spaceId;
      summary.dependencyEditor.dependencySnapshot.forEach(i => {
        payload += '&dependency=' + i.package + ':' + i.version;
      });
      if (summary.gitHubDetails.login !== summary.gitHubDetails.organization) {
        payload += '&gitOrganization=' + summary.gitHubDetails.organization;
      }
    }
    return payload;
  }

  private getImportPayload(summary: Summary, spaceId: string, spaceName: string) {
    let payload = '';
    if (summary && summary.dependencyCheck && summary.pipeline && summary.gitHubDetails) {
      payload =
      '&pipeline=' + summary.pipeline.id +
      '&projectName=' + summary.dependencyCheck.projectName +
      '&spacePath=' + spaceName +
      '&gitRepository=' + summary.gitHubDetails.repository +
      '&space=' + spaceId;
      if (summary.gitHubDetails.login !== summary.gitHubDetails.organization) {
        payload += '&gitOrganization=' + summary.gitHubDetails.organization;
      }
    }
    return payload;
  }

}
