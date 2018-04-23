import { ErrorHandler, Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { BehaviorSubject, Observable } from 'rxjs';

import {
  Logger,
  Notification,
  NotificationType
} from 'ngx-base';
import { User, UserService } from 'ngx-login-client';

import { NotificationsService } from 'app/shared/notifications.service';

export class OAuthConfig {
  public authorizeUri: string;
  public clientId: string;
  public logoutUri: string;
  public issuer: string;
  public apiServer: string;
  public proxyApiServer: string;
  public apiServerProtocol: string;
  public wsApiServerProtocol: string;
  public apiServerBasePath: string;
  public wsApiServerBasePath: string;
  public wsApiServer: string;
  public scope: string;
  public loaded: boolean;
  public openshiftConsoleUrl: string;
  public witApiUrl: string;
  public ssoApiUrl: string;
  public forgeApiUrl: string;
  public recommenderApiUrl: string;

  constructor(data: any) {
    var config = data || {};
    var oauth = config.oauth || {};

    this.loaded = data ? true : false;
    this.apiServer = config.api_server || '';
    this.proxyApiServer = config.proxy_api_server || '';
    this.apiServerProtocol = config.api_server_protocol;
    this.wsApiServerProtocol = config.ws_api_server_protocol || '';
    this.apiServerBasePath = config.api_server_base_path;
    this.wsApiServerBasePath = config.ws_api_server_base_path;
    this.wsApiServer = config.ws_api_server;
    this.authorizeUri = oauth.oauth_authorize_uri || '';
    this.clientId = oauth.oauth_client_id || 'fabric8';
    this.issuer = oauth.oauth_issuer || '';
    this.scope = oauth.oauth_scope || 'user:full';
    this.logoutUri = oauth.logout_uri || '';
    //this.openshiftConsoleUrl = config.openshift_console_url || '';
    this.witApiUrl = config.wit_api_url || '';
    this.ssoApiUrl = config.sso_api_url || '';
    this.forgeApiUrl = config.forge_api_url || '';
    this.recommenderApiUrl = config.recommender_api_url || '';

    if (!this.issuer && this.authorizeUri) {
      // lets default the issuer from the authorize Uri
      var url = this.authorizeUri;
      var idx = url.indexOf('/', 9);
      if (idx > 0) {
        url = url.substring(0, idx);
      }
      this.issuer = url;
      //console.log("Defaulted the issuer URL to: " + this.issuer);
    }
  }
}

/**
 * Lets keep around the singleton results to avoid doing too many requests for this static data
 */
var _latestOAuthConfig: OAuthConfig = new OAuthConfig(null);

let _currentOAuthConfig: BehaviorSubject<OAuthConfig> = new BehaviorSubject(_latestOAuthConfig);
let _loadingOAuthConfig: BehaviorSubject<boolean> = new BehaviorSubject(true);

export function currentOAuthConfig() {
  return _latestOAuthConfig;
}

@Injectable()
export class OAuthConfigStore {

  constructor(
    private readonly http: Http,
    private readonly userService: UserService,
    private readonly logger: Logger,
    private readonly errorHandler: ErrorHandler,
    private readonly notifications: NotificationsService
  ) {
    this.load();
  }

  get resource(): Observable<OAuthConfig> {
    return _currentOAuthConfig.asObservable();
  }

  get loading(): Observable<boolean> {
    return _loadingOAuthConfig.asObservable();
  }

  /**
   * Returns whether we are running against openshift.
   *
   * NOTE this is intended to be invoked after the OAuthConfigStore has finished loading via the .loading() Observable<boolean>!
   *
   * @return {boolean} true if this cluster is using openshift
   */
  get config(): OAuthConfig {
    let answer = _latestOAuthConfig;
    if (!answer) {
      console.log('WARNING: invoked the isOpenShift() method before the OAuthConfigStore has loaded!');
    }
    return answer;
  }

  private load() {
    let configUri = '/_config/oauth.json';
    this.http.get(configUri)
      .catch((error: Response) => {
        this.errorHandler.handleError(error);
        this.logger.error(error);
        this.notifications.message({
          type: NotificationType.DANGER,
          header: 'Error: Configuration setup',
          message: 'Could not find OAuth configuration at ' + configUri
        } as Notification);
        _currentOAuthConfig.next(_latestOAuthConfig);
        _loadingOAuthConfig.next(false);
        return Observable.empty();
      })
      .subscribe(
        (res: Response) => {
          let data = res.json();
          for (let key in data) {
            let value = data[key];
            if (value === 'undefined') {
              data[key] = '';
            }
          }
          _latestOAuthConfig = new OAuthConfig(data);
          this.userService.loggedInUser
            .first((user: User) => user.attributes !== null && user.attributes.cluster !== null)
            .subscribe(
              (user: User) => {
                let cluster = user.attributes.cluster;
                _latestOAuthConfig.openshiftConsoleUrl = cluster.replace('api', 'console') + 'console';
                _currentOAuthConfig.next(_latestOAuthConfig);
              },
              (error) => {
                this.errorHandler.handleError(error);
                this.logger.error(error);
                this.notifications.message({
                  type: NotificationType.DANGER,
                  header: 'Error: Configuration setup',
                  message: 'Could not acquire user credentials for oauthconfig setup'
                } as Notification);
                _currentOAuthConfig.next(_latestOAuthConfig);
              }
            );
          _currentOAuthConfig.next(_latestOAuthConfig);
          _loadingOAuthConfig.next(false);
        });
  }
}
