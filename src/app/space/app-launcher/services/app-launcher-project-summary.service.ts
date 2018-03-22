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

import { ContextService } from '../../../shared/context.service';

@Injectable()
export class AppLauncherProjectSummaryService implements ProjectSummaryService {

  // TODO: remove the hardcodes
  private END_POINT: string = '';
  private API_BASE: string = 'osio/launch';
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
   * @param {Summary} summary The project summary
   * @returns {Observable<boolean>}
   */
  setup(summary: Summary, spaceId: string, spaceName: string): Observable<boolean> {
    let summaryEndPoint: string = this.END_POINT + this.API_BASE;
    return this.options.flatMap((option) => {
      return this.http.post(summaryEndPoint, this.getPayload(summary, spaceId, spaceName), option)
        .map(response => {
          console.log(response.json());
          return response.json();
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
    return this.context.current;
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
    let payload =
    'missionId=' + summary.mission.id +
    '&runtimeId=' + summary.runtime.id +
    '&runtimeVersion=' + summary.runtime.version.id +
    '&pipelineId=' + summary.pipeline.id +
    '&projectName=' + summary.dependencyCheck.projectName +
    '&projectVersion=' + summary.dependencyCheck.projectVersion +
    '&groupId=' + summary.dependencyCheck.groupId +
    '&artifactId=' + summary.dependencyCheck.mavenArtifact +
    '&spacePath=' + spaceName +
    '&gitRepository=' + summary.gitHubDetails.repository +
    '&spaceId=' + spaceId;
    if (summary.gitHubDetails.login !== summary.gitHubDetails.organization) {
      payload += '&gitOrganization=' + summary.gitHubDetails.organization;
    }
    return payload;
  }

}
