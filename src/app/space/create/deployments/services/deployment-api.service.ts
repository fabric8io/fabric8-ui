import {
  Inject,
  Injectable
} from '@angular/core';
import {
  Headers,
  Http,
  Response
} from '@angular/http';
import { Observable } from 'rxjs';

import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

import {
  Application,
  ApplicationsResponse,
  EnvironmentsResponse,
  EnvironmentStat,
  MultiTimeseriesData,
  MultiTimeseriesResponse,
  TimeseriesData,
  TimeseriesResponse
} from './deployments.service';

@Injectable()
export class DeploymentApiService {

  private readonly headers: Headers = new Headers();
  private readonly apiUrl: string;

  constructor(
    private http: Http,
    @Inject(WIT_API_URL) private witUrl: string,
    private auth: AuthenticationService
  ) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    this.apiUrl = witUrl + 'deployments/spaces/';
  }

  getEnvironments(spaceId: string): Observable<EnvironmentStat[]> {
    const encSpaceId = encodeURIComponent(spaceId);
    return this.httpGet(`${this.apiUrl}${encSpaceId}/environments`)
      .map((response: Response): EnvironmentStat[] => (response.json() as EnvironmentsResponse).data);
  }

  getApplications(spaceId: string): Observable<Application[]> {
    const encSpaceId = encodeURIComponent(spaceId);
    return this.httpGet(`${this.apiUrl}${encSpaceId}`)
      .map((response: Response): Application[] => (response.json() as ApplicationsResponse).data.attributes.applications);
  }

  getTimeseriesData(spaceId: string, environmentName: string, applicationId: string, startTime: number, endTime: number): Observable<MultiTimeseriesData> {
    const encSpaceId = encodeURIComponent(spaceId);
    const encEnvironmentName = encodeURIComponent(environmentName);
    const encApplicationId = encodeURIComponent(applicationId);
    const url = `${this.apiUrl}${encSpaceId}/applications/${encApplicationId}/deployments/${encEnvironmentName}/statseries?start=${startTime}&end=${endTime}`;
    return this.httpGet(url)
      .map((response: Response) => (response.json() as MultiTimeseriesResponse).data);
  }

  getLatestTimeseriesData(spaceId: string, environmentName: string, applicationId: string): Observable<TimeseriesData> {
    const encSpaceId = encodeURIComponent(spaceId);
    const encEnvironmentName = encodeURIComponent(environmentName);
    const encApplicationId = encodeURIComponent(applicationId);
    const url = `${this.apiUrl}${encSpaceId}/applications/${encApplicationId}/deployments/${encEnvironmentName}/stats`;
    return this.httpGet(url)
      .map((response: Response) => (response.json() as TimeseriesResponse).data.attributes);
  }

  private httpGet(url: string): Observable<Response> {
    return this.http.get(url, { headers: this.headers });
  }

}
