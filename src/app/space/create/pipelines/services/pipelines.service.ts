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

import { NotificationsService } from 'app/shared/notifications.service';

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

  constructor(
    private readonly http: Http,
    private readonly auth: AuthenticationService,
    private readonly logger: Logger,
    private readonly errorHandler: ErrorHandler,
    private readonly notifications: NotificationsService,
    @Inject(WIT_API_URL) private readonly witUrl: string
  ) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    this.apiUrl = witUrl + 'user/services';
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

  private handleHttpError(response: Response): Observable<any> {
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
