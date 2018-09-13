import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import _ from 'lodash';
import {
  HelperService,
  ProjectSummaryService,
  Summary
} from 'ngx-launcher';
import { AuthenticationService } from 'ngx-login-client';
import { Observable,  throwError as observableThrowError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { ContextService } from '../../../shared/context.service';

@Injectable()
export class AppLauncherProjectSummaryService implements ProjectSummaryService {

  // TODO: remove the hardcodes
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Git-Provider': 'GitHub'
  });
  private END_POINT: string = '';
  private API_BASE_CREATE: string = 'osio/launch';
  private API_BASE_IMPORT: string = 'osio/import';
  private ORIGIN: string = '';

  constructor(
    private http: HttpClient,
    private context: ContextService,
    private helperService: HelperService,
    private auth: AuthenticationService
  ) {
    this.END_POINT = this.helperService.getBackendUrl();
    this.ORIGIN = this.helperService.getOrigin();
    if (this.auth.getToken() != null) {
      this.headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    if (this.ORIGIN) {
      this.headers = this.headers.set('X-App', this.ORIGIN);
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
  setup(summary: Summary, retry?: number): Observable<any> {
    this.headers = this.headers.set('X-Execution-Step-Index', String(retry || 0));

    return this.context.current.pipe(mergeMap(c => {
      let summaryEndPoint = this.END_POINT + (summary.mission ? this.API_BASE_CREATE : this.API_BASE_IMPORT);
      let payload = this.getPayload(summary, c.space ? c.space.id : '', c.name);
      console.log('URL - ', summaryEndPoint);
      return this.http
        .post(summaryEndPoint, payload, { headers: this.headers }).pipe(
        catchError(this.handleError));
      }));
  }

  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string = '';
    if (error instanceof HttpResponse) {
      if (error.status !== 401) {
        const body = error.body || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return observableThrowError(errMsg);
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
