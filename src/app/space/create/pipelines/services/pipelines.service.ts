import {
  ErrorHandler,
  Inject,
  Injectable
} from '@angular/core';
import {
  Headers,
  Http,
  Response
} from '@angular/http';

import {
  Observable,
  Subscription
} from 'rxjs';

import {
  Logger,
  Notification,
  NotificationType
} from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

import { NotificationsService } from '../../../../shared/notifications.service';

import { BuildConfig } from '../../../../../a-runtime-console/index';

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

  private readonly headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private readonly apiUrl: string;
  private loggedIn: boolean = false;

  constructor(
    private readonly http: Http,
    private readonly auth: AuthenticationService,
    private readonly runtimePipelinesService: RuntimePipelinesService,
    private readonly logger: Logger,
    private readonly errorHandler: ErrorHandler,
    private readonly notifications: NotificationsService,
    @Inject(WIT_API_URL) private readonly witUrl: string
  ) {
    let token: string = this.auth.getToken();
    if (token != null && token != '') {
      this.headers.set('Authorization', `Bearer ${token}`);
      this.loggedIn = true;
    }
    this.apiUrl = witUrl + 'user/services';
  }

  getCurrentPipelines(): Observable<BuildConfig[]> {
    return Observable.combineLatest(
      this.runtimePipelinesService.current.distinctUntilChanged(),
      this.getOpenshiftConsoleUrl(),
      this.setupBuildConfigLinks
    );
  }

  getRecentPipelines(): Observable<BuildConfig[]> {
    return Observable.combineLatest(
      this.runtimePipelinesService.recentPipelines.distinctUntilChanged(),
      this.getOpenshiftConsoleUrl(),
      this.setupBuildConfigLinks
    );
  }

  getOpenshiftConsoleUrl(): Observable<string> {
    return this.http.get(this.apiUrl, { headers: this.headers })
      .map((resp: Response) => resp.json() as UserServiceResponse)
      .catch((err: Response) => this.handleHttpError(err))
      .map((resp: UserServiceResponse) => resp.data.attributes.namespaces)
      .map((namespaces: UserServiceNamespace[]) => {
        for (let namespace of namespaces) {
          if (namespace.name && namespace.type && namespace.type === 'user' && namespace['cluster-console-url']) {
            return namespace['cluster-console-url'] + 'project/' + namespace.name + '/browse/pipelines';
          }
        }

        return '';
      });
  }

  private setupBuildConfigLinks(buildConfigs: BuildConfig[], consoleUrl: string): BuildConfig[] {
    if (consoleUrl) {
      for (let build of buildConfigs) {
        build.openShiftConsoleUrl = `${consoleUrl}/${build.name}`;
        build.editPipelineUrl = build.openShiftConsoleUrl.replace('browse', 'edit');
        if (build.interestingBuilds) {
          for (let b of build.interestingBuilds) {
            b.openShiftConsoleUrl = `${build.openShiftConsoleUrl}/${build.name}-${b.buildNumber}`;
          }
        }
      }
    }
    return buildConfigs;
  }

  private handleHttpError(response: Response): Observable<any> {
    // If it's a 401 and they are not logged in, don't trigger an error
    if (response.status === 401 && !this.loggedIn) {
      return Observable.empty();
    }
    this.errorHandler.handleError(response);
    this.logger.error(response);
    this.notifications.message({
      type: NotificationType.DANGER,
      header: `Request failed: ${response.status} (${response.statusText})`,
      message: response.text()
    } as Notification);
    return Observable.empty();
  }
}
