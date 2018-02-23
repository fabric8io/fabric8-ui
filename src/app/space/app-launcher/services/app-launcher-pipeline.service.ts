import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import {
  HelperService,
  Pipeline,
  PipelineService,
  TokenProvider
} from 'ngx-forge';

@Injectable()
export class AppLauncherPipelineService implements PipelineService {

  // TODO: remove the hardcodes
  private END_POINT: string = '';
  private API_BASE: string = 'services/jenkins/pipelines';
  private ORIGIN: string = '';

  constructor(private http: Http,
              private helperService: HelperService,
              private tokenProvider: TokenProvider) {
    if (this.helperService) {
      this.END_POINT = this.helperService.getBackendUrl();
      this.ORIGIN = this.helperService.getOrigin();
    }
  }

  private get options(): Observable<RequestOptions> {
    let headers = new Headers();
    headers.append('X-App', this.ORIGIN);
    return Observable.fromPromise(this.tokenProvider.token.then((token) => {
      headers.append('Authorization', 'Bearer ' + token);
      return new RequestOptions({
        headers: headers
      });
    }));
  }

/*
  getPipelines(): Observable<Pipeline[]> {
    let runtimeEndPoint: string = this.END_POINT + this.API_BASE;
    return this.options.flatMap((option) => {
      return this.http.get(runtimeEndPoint, option)
        .map(response => response.json() as Pipeline[])
        .catch(this.handleError);
    });
  }
*/

  // Save for demo
  getPipelines(): Observable<Pipeline[]> {
    let pipelines = Observable.of([{
      'id': 'maven-release',
      'platform': 'maven',
      'name': 'Release',
      'stages': [{
        'name': 'Build Release',
        'description': 'Creates a new version then builds and deploys the project into the maven repository'
      }, {
        'name': 'Integration Test',
        'description': 'Runs an integration test in the **Test** environment'
      }],
      'suggested': false,
      'techpreview': false
    }, {
      'id': 'maven-releaseandstage',
      'platform': 'maven',
      'name': 'Release and Stage',
      'stages': [{
        'name': 'Build Release',
        'description': 'Creates a new version then builds and deploys the project into the maven repository'
      }, {
        'name': 'Integration Test',
        'description': 'Runs an integration test in the **Test** environment'
      }, {
        'name': 'Rollout to Stage',
        'description': 'Stages the new version into the **Stage** environment'
      }],
      'suggested': false,
      'techpreview': false
    }, {
      'id': 'maven-releasestageapproveandpromote',
      'platform': 'maven',
      'name': 'Release, Stage, Approve and Promote',
      'stages': [{
        'name': 'Build Release',
        'description': 'Creates a new version then builds and deploys the project into the maven repository'
      }, {
        'name': 'Integration Test',
        'description': 'Runs an integration test in the **Test** environment'
      }, {
        'name': 'Rollout to Stage',
        'description': 'Stages the new version into the **Stage** environment'
      }, {
        'name': 'Approve',
        'description': 'Waits for **Approval** to promote'
      }, {
        'name': 'Rollout to Run',
        'description': 'Promotes to the **Run** environment'
      }],
      'suggested': true,
      'techpreview': false
    }] as Pipeline[]);
    return pipelines;
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
