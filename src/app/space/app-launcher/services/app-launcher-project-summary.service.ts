import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  RequestOptions,
  Response
} from '@angular/http';

import _ from 'lodash';
import { Observable } from 'rxjs';

import {
  HelperService,
  ProjectSummaryService,
  Summary,
  TokenProvider
} from 'ngx-launcher';

import { ContextService } from '../../../shared/context.service';

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
    this.END_POINT = this.helperService.getBackendUrl();
    this.ORIGIN = this.helperService.getOrigin();
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
  setup(summary: Summary, retry?: number): Observable<any> {
    return this.context.current.flatMap(c => {
      let summaryEndPoint = this.END_POINT + (summary.mission ? this.API_BASE_CREATE : this.API_BASE_IMPORT);
      let payload = this.getPayload(summary, c.space ? c.space.id : '', c.name);
      return this.options(retry).flatMap((option) => {
        return this.http.post(summaryEndPoint, payload, option)
          .map(response => {
            if (response) {
              return response.json();
            }
          })
          .catch(this.handleError);
      });
    });
  }

  private options(retry?: number): Observable<RequestOptions> {
    let headers = new Headers();
    headers.append('X-App', this.ORIGIN);
    headers.append('X-Git-Provider', 'GitHub');
    headers.append('X-Execution-Step-Index', String(retry || 0));
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

  private getPayload(summary: Summary, spaceId: string, spaceName: string) {
    let payload = '';
    let missionId: string = _.get(summary, 'mission.id', '');
    let blankMissionId: string = 'blank-mission';
    if (missionId === blankMissionId) {
      missionId = _.get(summary, 'mission.meta', '');
      payload += 'emptyGitRepository=true&';
    }
    payload += 'mission=' + missionId;
    payload += '&runtime=' + _.get(summary, 'runtime.id', '');
    payload += '&runtimeVersion=' + _.get(summary, 'runtime.version.id', '');
    payload += '&pipeline=' + _.get(summary, 'pipeline.id', '');
    payload += '&projectName=' + _.get(summary, 'dependencyCheck.projectName', '');
    payload += '&projectVersion=' + _.get(summary, 'dependencyCheck.projectVersion', '');
    payload += '&gitRepository=' + _.get(summary, 'gitHubDetails.repository', '');
    payload += '&groupId=' + _.get(summary, 'dependencyCheck.groupId', '');
    /* artifactId has to be same as projectName in OSIO to get correct links for
      stage/prod to be shown in pipelines view */
    payload += '&artifactId=' + _.get(summary, 'dependencyCheck.projectName', '');
    payload += '&spacePath=' + spaceName;
    payload += '&space=' + spaceId;
    if (summary.dependencyEditor && summary.dependencyEditor.dependencySnapshot) {
      summary.dependencyEditor.dependencySnapshot.forEach(i => {
        payload += '&dependency=' + i.package + ':' + i.version;
      });
    }
    if (summary.gitHubDetails.login !== summary.gitHubDetails.organization) {
      payload += '&gitOrganization=' + summary.gitHubDetails.organization;
    }

    return payload;
  }
}
