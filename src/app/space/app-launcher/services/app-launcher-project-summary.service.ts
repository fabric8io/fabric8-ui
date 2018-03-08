import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  RequestOptions,
  Response
} from '@angular/http';

import { Observable } from 'rxjs';

import {
  HelperService,
  ProjectSummaryService,
  Summary,
  TokenProvider
} from 'ngx-forge';

@Injectable()
export class AppLauncherProjectSummaryService implements ProjectSummaryService {

  // TODO: remove the hardcodes
  private END_POINT: string = '';
  private API_BASE: string = 'osio/launch';
  private ORIGIN: string = '';

  constructor(
    private http: Http,
    private helperService: HelperService,
    private tokenProvider: TokenProvider
  ) {
    if (this.helperService) {
      this.END_POINT = this.helperService.getBackendUrl();
      this.ORIGIN = this.helperService.getOrigin();
    }
  }

  private get options(): Observable<RequestOptions> {
    let headers = new Headers();
    headers.append('X-App', this.ORIGIN);
    headers.append('X-Git-Provider', 'GitHub');
    headers.append('X-Execution-Step-Index', '0');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return Observable.fromPromise(this.tokenProvider.token.then((token) => {
      headers.append('Authorization', 'Bearer ' + token);
      return new RequestOptions({
        headers: headers
      });
    }));
  }

  /**
   * Set up the project for the given summary
   *
   * @param {Summary} summary The project summary
   * @returns {Observable<boolean>}
   */
  setup(summary: Summary): Observable<boolean> {
    let summaryEndPoint: string = this.END_POINT + this.API_BASE;
    return this.options.flatMap((option) => {
      return this.http.post(summaryEndPoint, this.getPayload(summary), option)
        .map(response => {
          console.log(response.json());
          return response.json();
        })
        .catch(this.handleError);
    });
  }

  /**
   * Verify the project for the given summary
   *
   * @param {Summary} summary The project summary
   * @returns {Observable<boolean>}
   */
  verify(summary: Summary): Observable<boolean> {
    return Observable.of(true);
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

  private getPayload(summary: Summary) {
    let payload =
    'missionId=' + summary.mission.id +
    '&runtimeId=' + summary.runtime.id +
    '&runtimeVersion=' + summary.runtime.version.id +
    '&pipelineId=' + summary.pipeline.id +
    '&projectName=' + summary.dependencyCheck.projectName +
    '&projectVersion=' + summary.dependencyCheck.projectVersion +
    '&groupId=' + summary.dependencyCheck.groupId +
    '&artifactId=' + summary.dependencyCheck.mavenArtifact +
    '&spacePath=' + summary.dependencyCheck.spacePath +
    '&gitRepository=' + summary.gitHubDetails.repository;
    if (summary.gitHubDetails.login !== summary.gitHubDetails.organization) {
      payload += '&gitOrganization=' + summary.gitHubDetails.organization;
    }
    return payload;
  }

}
