import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Logger, Notification, NotificationType } from 'ngx-base';
import { User, UserService } from 'ngx-login-client';
import { BehaviorSubject, empty as observableEmpty, Observable } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { NotificationsService } from '../../../app/shared/notifications.service';

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

  public buildToolDetectorApiUrl: string;

  constructor(data: any) {
    const config = data || {};
    const oauth = config.oauth || {};

    this.loaded = !!data;
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
    // this.openshiftConsoleUrl = config.openshift_console_url || '';
    this.witApiUrl = config.wit_api_url || '';
    this.ssoApiUrl = config.sso_api_url || '';
    this.forgeApiUrl = config.forge_api_url || '';
    this.recommenderApiUrl = config.recommender_api_url || '';
    this.buildToolDetectorApiUrl = config.build_tool_detector_api_url || '';

    if (!this.issuer && this.authorizeUri) {
      // lets default the issuer from the authorize Uri
      let url = this.authorizeUri;
      const idx = url.indexOf('/', 9);
      if (idx > 0) {
        url = url.substring(0, idx);
      }
      this.issuer = url;
      // console.log("Defaulted the issuer URL to: " + this.issuer);
    }
  }
}

/**
 * Lets keep around the singleton results to avoid doing too many requests for this static data
 */
let _latestOAuthConfig: OAuthConfig = new OAuthConfig(null);

const _currentOAuthConfig: BehaviorSubject<OAuthConfig> = new BehaviorSubject(_latestOAuthConfig);
const _loadingOAuthConfig: BehaviorSubject<boolean> = new BehaviorSubject(true);

export function currentOAuthConfig() {
  return _latestOAuthConfig;
}

@Injectable()
export class OAuthConfigStore {
  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService,
    private readonly logger: Logger,
    private readonly errorHandler: ErrorHandler,
    private readonly notifications: NotificationsService,
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
    const answer = _latestOAuthConfig;
    if (!answer) {
      console.log(
        'WARNING: invoked the isOpenShift() method before the OAuthConfigStore has loaded!',
      );
    }
    return answer;
  }

  private load() {
    const configUri = '/_config/oauth.json';
    this.http
      .get(configUri)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorHandler.handleError(error);
          this.logger.error(error);
          this.notifications.message({
            type: NotificationType.DANGER,
            header: 'Error: Configuration setup',
            message: `Could not find OAuth configuration at ${configUri}`,
          } as Notification);
          _currentOAuthConfig.next(_latestOAuthConfig);
          _loadingOAuthConfig.next(false);
          return observableEmpty();
        }),
      )
      .subscribe((res: HttpResponse<any>) => {
        const data = res;
        for (const key in data) {
          if (key && data[key]) {
            const value = data[key];
            if (value === 'undefined') {
              data[key] = '';
            }
          }
        }
        _latestOAuthConfig = new OAuthConfig(data);
        /**
         * openshiftConsoleUrl is set late and another emission occurs
         * so users who do not need it are not blocked from continuing.
         * Users who do need it should subscribe and wait for the
         * emission that contains the property.
         */
        this.userService.loggedInUser
          .pipe(first((user: User) => user.attributes != null && user.attributes.cluster != null))
          .subscribe(
            (user: User) => {
              const cluster = user.attributes.cluster;
              _latestOAuthConfig.openshiftConsoleUrl = `${cluster.replace(
                'api',
                'console',
              )}console`;
              _currentOAuthConfig.next(_latestOAuthConfig);
            },
            (error) => {
              this.errorHandler.handleError(error);
              this.logger.error(error);
              this.notifications.message({
                type: NotificationType.DANGER,
                header: 'Error: Configuration setup',
                message: 'Could not acquire user credentials for oauthconfig setup',
              } as Notification);
              _currentOAuthConfig.next(_latestOAuthConfig);
            },
          );
        _currentOAuthConfig.next(_latestOAuthConfig);
        _loadingOAuthConfig.next(false);
      });
  }
}
