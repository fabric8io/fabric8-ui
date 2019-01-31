import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { Logger, Notification, NotificationType } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import {
  combineLatest as observableCombineLatest,
  empty as observableEmpty,
  Observable,
} from 'rxjs';
import { catchError, distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { BuildConfig } from '../../../../../a-runtime-console/index';
import { NotificationsService } from '../../../../shared/notifications.service';
import { PipelinesService as RuntimePipelinesService } from '../../../../shared/runtime-console/pipelines.service';

export interface UserServiceResponse {
  data: UserServiceData;
}

export interface UserServiceData {
  attributes: UserServiceAttributes;
}

export interface UserServiceAttributes {
  namespaces: UserServiceNamespace[];
}

export interface UserServiceNamespace {
  name: string;
  type: string;
  'cluster-console-url': string;
}

@Injectable()
export class PipelinesService {
  private readonly headers: HttpHeaders;

  private readonly apiUrl: string;

  private loggedIn: boolean = false;

  private openshiftConsoleUrl: Observable<string>;

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthenticationService,
    private readonly runtimePipelinesService: RuntimePipelinesService,
    private readonly logger: Logger,
    private readonly errorHandler: ErrorHandler,
    private readonly notifications: NotificationsService,
    @Inject(WIT_API_URL) witUrl: string,
  ) {
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token: string = this.auth.getToken();
    if (token != null && token != '') {
      headers = headers.set('Authorization', `Bearer ${token}`);
      this.loggedIn = true;
    }
    this.headers = headers;
    this.apiUrl = witUrl + 'user/services';
  }

  getCurrentPipelines(): Observable<BuildConfig[]> {
    return observableCombineLatest(
      this.runtimePipelinesService.current.pipe(distinctUntilChanged()),
      this.getOpenshiftConsoleUrl(),
      this.setupBuildConfigLinks,
    );
  }

  getRecentPipelines(): Observable<BuildConfig[]> {
    return observableCombineLatest(
      this.runtimePipelinesService.recentPipelines.pipe(distinctUntilChanged()),
      this.getOpenshiftConsoleUrl(),
      this.setupBuildConfigLinks,
    );
  }

  getOpenshiftConsoleUrl(): Observable<string> {
    if (!this.openshiftConsoleUrl) {
      this.openshiftConsoleUrl = this.http
        .get<UserServiceResponse>(this.apiUrl, { headers: this.headers })
        .pipe(
          catchError(
            (err: HttpErrorResponse): Observable<UserServiceResponse> => this.handleHttpError(err),
          ),
          map(
            (resp: UserServiceResponse): UserServiceNamespace[] => resp.data.attributes.namespaces,
          ),
          map(
            (namespaces: UserServiceNamespace[]): string => {
              for (const namespace of namespaces) {
                if (
                  namespace.name &&
                  namespace.type &&
                  namespace.type === 'user' &&
                  namespace['cluster-console-url']
                ) {
                  return (
                    namespace['cluster-console-url'] +
                    'project/' +
                    namespace.name +
                    '/browse/pipelines'
                  );
                }
              }
              return '';
            },
          ),
          shareReplay(),
        );
    }

    return this.openshiftConsoleUrl;
  }

  private setupBuildConfigLinks(buildConfigs: BuildConfig[], consoleUrl: string): BuildConfig[] {
    if (consoleUrl) {
      for (const build of buildConfigs) {
        build.openShiftConsoleUrl = `${consoleUrl}/${build.name}`;
        build.editPipelineUrl = build.openShiftConsoleUrl.replace('browse', 'edit');
        if (build.interestingBuilds) {
          for (const b of build.interestingBuilds) {
            b.openShiftConsoleUrl = `${build.openShiftConsoleUrl}/${build.name}-${b.buildNumber}`;
          }
        }
      }
    }
    return buildConfigs;
  }

  private handleHttpError(response: HttpErrorResponse): Observable<any> {
    // If it's a 401 and they are not logged in, don't trigger an error
    if (response.status === 401 && !this.loggedIn) {
      return observableEmpty();
    }
    this.errorHandler.handleError(response);
    this.logger.error(response);
    this.notifications.message({
      type: NotificationType.DANGER,
      header: `Request failed: ${response.status} (${response.statusText})`,
      message: response.message,
    } as Notification);
    return observableEmpty();
  }
}
