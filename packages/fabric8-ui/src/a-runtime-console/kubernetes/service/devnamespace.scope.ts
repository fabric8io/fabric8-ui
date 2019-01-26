import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { BehaviorSubject, Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { pathJoin } from '../model/utils';
import { INamespaceScope } from './namespace.scope';

/**
 * Defaults to using the Dev Space rather than the runtime environment
 * for things like BuildConfig or Builds
 */
@Injectable()
export class DevNamespaceScope implements INamespaceScope {
  public namespace: Observable<string>;

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  protected userServicesUrl: string;
  private currentNamespaceValue: string;

  constructor(
    private logger: Logger,
    private auth: AuthenticationService,
    private http: HttpClient,
    @Inject(WIT_API_URL) apiUrl: string,
  ) {
    if (this.auth.getToken() != null) {
      this.headers = this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.userServicesUrl = pathJoin(apiUrl, '/user/services');

    //  query the user namespace from WIT API
    this.namespace = this.http.get(this.userServicesUrl, { headers: this.headers }).pipe(
      shareReplay(),
      map((resp: HttpResponse<any>) => {
        let namespace = this.extractUserNamespace(resp);
        if (namespace) {
          this.currentNamespaceValue = namespace;
        }
        return namespace;
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  currentNamespace(): any {
    return this.currentNamespaceValue;
  }

  private handleError(error: any) {
    this.logger.error(error);
    return observableThrowError(error.message || error);
  }

  private extractUserNamespace(json: any): string {
    if (json) {
      let data = json['data'];
      if (data) {
        let attributes = data['attributes'];
        if (attributes) {
          let namespaces = attributes['namespaces'];
          if (namespaces) {
            for (let namespace of namespaces) {
              let name = namespace['name'];
              let type = namespace['type'];
              if (name && type && type === 'user') {
                return name;
              }
            }
          }
        }
      }
    }
    return null;
  }
}

export class TestDevNamespaceScope implements INamespaceScope {
  _currentNamespace = 'mynamespace';

  namespace: Observable<string> = new BehaviorSubject(this._currentNamespace).asObservable();

  currentNamespace(): string {
    return this._currentNamespace;
  }
}
