import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { pathJoin } from '../model/utils';
import { INamespaceScope } from './namespace.scope';

/**
 * Defaults to using the Dev Space rather than the runtime environment
 * for things like BuildConfig or Builds
 */
@Injectable()
export class DevNamespaceScope implements INamespaceScope {
  public namespace: Observable<string>;

  private headers = new Headers({'Content-Type': 'application/json'});
  protected userServicesUrl: string;
  private currentNamespaceValue: string;

  constructor(private logger: Logger,
              private auth: AuthenticationService,
              private http: Http,
              @Inject(WIT_API_URL) apiUrl: string) {

    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.userServicesUrl = pathJoin(apiUrl, '/user/services');

    //  query the user namespace from WIT API
    this.namespace = this.http
      .get(this.userServicesUrl, {headers: this.headers})
      .map(response => {
        let namespace = this.extractUserNamespace(response.json());
        if (namespace) {
          this.currentNamespaceValue = namespace;
        }
        return namespace;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  currentNamespace(): any {
    return this.currentNamespaceValue;
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }

  private extractUserNamespace(json: string): string {
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
