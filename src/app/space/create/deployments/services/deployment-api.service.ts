import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import {
  ErrorHandler,
  Inject,
  Injectable
} from '@angular/core';
import { Observable } from 'rxjs';

import { Logger } from 'ngx-base';
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

  private readonly headers: HttpHeaders = new HttpHeaders();
  private readonly apiUrl: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(WIT_API_URL) private readonly witUrl: string,
    private readonly auth: AuthenticationService,
    private readonly logger: Logger,
    private readonly errorHandler: ErrorHandler
  ) {
    if (this.auth.getToken() != null) {
      this.headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    this.apiUrl = witUrl + 'deployments/spaces/';
  }

  getEnvironments(spaceId: string): Observable<EnvironmentStat[]> {
    const encSpaceId: string = encodeURIComponent(spaceId);
    return this.httpGet<EnvironmentsResponse>(`${this.apiUrl}${encSpaceId}/environments`)
      .map((response: EnvironmentsResponse): EnvironmentStat[] => response.data);
  }

  getApplications(spaceId: string): Observable<Application[]> {
    const encSpaceId = encodeURIComponent(spaceId);
    return this.httpGet<ApplicationsResponse>(`${this.apiUrl}${encSpaceId}`)
      .map((response: ApplicationsResponse): Application[] => response.data.attributes.applications);
  }

  getTimeseriesData(spaceId: string, environmentName: string, applicationId: string, startTime: number, endTime: number): Observable<MultiTimeseriesData> {
    const encSpaceId = encodeURIComponent(spaceId);
    const encEnvironmentName = encodeURIComponent(environmentName);
    const encApplicationId = encodeURIComponent(applicationId);
    const url = `${this.apiUrl}${encSpaceId}/applications/${encApplicationId}/deployments/${encEnvironmentName}/statseries?start=${startTime}&end=${endTime}`;
    return this.httpGet<MultiTimeseriesResponse>(url)
      .map((response: MultiTimeseriesResponse) => response.data);
  }

  getLatestTimeseriesData(spaceId: string, environmentName: string, applicationId: string): Observable<TimeseriesData> {
    const encSpaceId = encodeURIComponent(spaceId);
    const encEnvironmentName = encodeURIComponent(environmentName);
    const encApplicationId = encodeURIComponent(applicationId);
    const url = `${this.apiUrl}${encSpaceId}/applications/${encApplicationId}/deployments/${encEnvironmentName}/stats`;
    return this.httpGet<TimeseriesResponse>(url)
      .map((response: TimeseriesResponse) => response.data.attributes);
  }

  deleteDeployment(spaceId: string, environmentName: string, applicationId: string): Observable<HttpResponse<any>> {
    const encSpaceId = encodeURIComponent(spaceId);
    const encEnvironmentName = encodeURIComponent(environmentName);
    const encApplicationId = encodeURIComponent(applicationId);
    const url = `${this.apiUrl}${encSpaceId}/applications/${encApplicationId}/deployments/${encEnvironmentName}`;
    return this.http.delete(url, { headers: this.headers, responseType: 'text' })
      .catch((err: HttpErrorResponse) => this.handleHttpError(err));
  }

  scalePods(spaceId: string, environmentName: string, applicationId: string, desiredReplicas: number): Observable<HttpResponse<any>> {
    const encSpaceId = encodeURIComponent(spaceId);
    const encEnvironmentName = encodeURIComponent(environmentName);
    const encApplicationId = encodeURIComponent(applicationId);
    const url = `${this.apiUrl}${encSpaceId}/applications/${encApplicationId}/deployments/${encEnvironmentName}?podCount=${desiredReplicas}`;
    return this.http.put(url, '', { headers: this.headers, responseType: 'text' })
      .catch((err: HttpErrorResponse) => this.handleHttpError(err));
  }

  private httpGet<T>(url: string): Observable<T> {
    return this.http.get<T>(url, { headers: this.headers })
      .catch((err: HttpErrorResponse) => this.handleHttpError(err));
  }

  private handleHttpError(err: HttpErrorResponse): Observable<any> {
    this.errorHandler.handleError(err);
    this.logger.error(err);
    return Observable.throw(err);
  }

}
