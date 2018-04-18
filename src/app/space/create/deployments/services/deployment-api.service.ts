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

import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';

export interface ApplicationsResponse {
  data: Space;
}

export interface Space {
  attributes: SpaceAttributes;
  id: string;
  type: string;
}

export interface SpaceAttributes {
  applications: Application[];
}

export interface Application {
  attributes: ApplicationAttributes;
  id: string;
  type: string;
}

export interface ApplicationAttributes {
  name: string;
  deployments: Deployment[];
}

export interface Deployment {
  attributes: DeploymentAttributes;
  links: Links;
  id: string;
  type: string;
}

export interface DeploymentAttributes {
  name: string;
  pod_total: number;
  pods: [[string, string]];
  pods_quota: PodsQuota;
  version: string;
}

export interface Links {
  application: string;
  console: string;
  logs: string;
}

export interface PodsQuota {
  cpucores: number;
  memory: number;
}

export interface EnvironmentsResponse {
  data: EnvironmentStat[];
}

export interface EnvironmentStat {
  attributes: EnvironmentAttributes;
  id: string;
  type: string;
}

export interface EnvironmentAttributes {
  name: string;
  quota: Quota;
}

export interface Quota {
  cpucores: CpuStat;
  memory: MemoryStat;
}

export interface TimeseriesResponse {
  data: DeploymentStats;
}

export interface MultiTimeseriesResponse {
  data: MultiTimeseriesData;
}

export interface DeploymentStats {
  attributes: TimeseriesData;
  id: string;
  type: string;
}

export interface TimeseriesData {
  cores: CoresSeries;
  memory: MemorySeries;
  net_tx: NetworkSentSeries;
  net_rx: NetworkReceivedSeries;
}

export interface MultiTimeseriesData {
  cores: CoresSeries[];
  memory: MemorySeries[];
  net_tx: NetworkSentSeries[];
  net_rx: NetworkReceivedSeries[];
  start: number;
  end: number;
}

export interface CoresSeries extends SeriesData { }

export interface MemorySeries extends SeriesData { }

export interface NetworkSentSeries extends SeriesData { }

export interface NetworkReceivedSeries extends SeriesData { }

export interface SeriesData {
  time: number;
  value: number;
}

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

  deleteDeployment(spaceId: string, environmentName: string, applicationId: string): Observable<Response> {
    const encSpaceId = encodeURIComponent(spaceId);
    const encEnvironmentName = encodeURIComponent(environmentName);
    const encApplicationId = encodeURIComponent(applicationId);
    const url = `${this.apiUrl}${encSpaceId}/applications/${encApplicationId}/deployments/${encEnvironmentName}`;
    return this.http.delete(url, { headers: this.headers });
  }

  scalePods(spaceId: string, environmentName: string, applicationId: string, desiredReplicas: number): Observable<Response> {
    const encSpaceId = encodeURIComponent(spaceId);
    const encEnvironmentName = encodeURIComponent(environmentName);
    const encApplicationId = encodeURIComponent(applicationId);
    const url = `${this.apiUrl}${encSpaceId}/applications/${encApplicationId}/deployments/${encEnvironmentName}?podCount=${desiredReplicas}`;
    return this.http.put(url, '', { headers: this.headers });
  }

  private httpGet(url: string): Observable<Response> {
    return this.http.get(url, { headers: this.headers });
  }

}
