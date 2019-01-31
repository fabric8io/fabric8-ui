import { $WebSocket } from 'angular2-websocket/angular2-websocket';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { OnLogin } from '../../shared/onlogin.service';
import { pathJoin } from '../model/utils';
import { currentOAuthConfig } from '../store/oauth-config-store';
import { Poller } from './poller';
import { PollerFactory } from './poller-factory.service';

export class Watcher<L> {
  protected ws: $WebSocket;

  protected serviceUrl: String;

  protected _dataStream: BehaviorSubject<any> = new BehaviorSubject(null);

  protected subscription: Subscription;

  protected retries = 0;

  protected connectTime = new Date().getTime();

  protected poller: Poller<L>;

  constructor(
    protected pathFn: () => String,
    protected queryParams: any = null,
    protected onLogin: OnLogin,
    protected listFactory: () => Observable<L>,
    protected pollerFactory: PollerFactory,
  ) {
    this.lazyCreateWebSocket();

    // send a single initial event to make it easier to combine
    // with the list observable
    this._dataStream.next({});
  }

  get dataStream(): Observable<any> {
    return this._dataStream.asObservable();
  }

  /**
   * Forces recreation of the web socket
   */
  recreateIfChanged() {
    if (this.poller) {
      this.poller.recreate();
      return;
    }
    const serviceUrl = this.pathFn();
    if (serviceUrl !== this.serviceUrl) {
      this.recreate();
    }
  }

  /**
   * Forces recreation of the web socket
   */
  recreate() {
    if (this.poller) {
      this.poller.recreate();
      return;
    }
    this.close();
    this.lazyCreateWebSocket();
  }

  get info(): string {
    return 'watch for ' + this.pathFn() + (this.queryParams ? ' query:  ' + this.queryParams : '');
  }

  close() {
    if (this.poller) {
      const poller = this.poller;
      this.poller = null;
      poller.close();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.closeWebSocket();
  }

  protected closeWebSocket() {
    const ws = this.ws;
    if (ws) {
      this.ws = null;
      ws.close();
    }
  }

  /**
   * Returns the query string appended to the websocket URL
   */
  protected get query(): String {
    const queryParams = this.queryParams;
    const params = {};
    if (queryParams) {
      for (const k in queryParams) {
        params[k] = queryParams[k];
      }
    }
    params['watch'] = true;
    params['access_token'] = this.onLogin.token;

    let query = '';
    for (const k in params) {
      const sep = query ? '&' : '';
      query += sep + k + '=' + encodeURIComponent(params[k]);
    }
    return query ? '?' + query : '';
  }

  protected lazyCreateWebSocket() {
    if (this.poller) {
      return;
    }
    if (!this.ws) {
      const authConfig = currentOAuthConfig();
      const wsApiServer = authConfig.wsApiServer;
      let baseUrl = '';
      let webSocketProtocol = authConfig.wsApiServerProtocol;
      if (!webSocketProtocol) {
        if (authConfig.apiServerProtocol === 'http') {
          webSocketProtocol = 'ws';
        }
      }
      if (!webSocketProtocol) {
        webSocketProtocol = 'wss';
      }
      if (webSocketProtocol.indexOf(":'") < 0) {
        webSocketProtocol += '://';
      }
      if (wsApiServer) {
        baseUrl = webSocketProtocol + wsApiServer;
      } else {
        const location = window.location;
        if (location) {
          const hostname = location.hostname;
          const port = location.port;
          if (hostname) {
            baseUrl = webSocketProtocol + hostname;
            if (port) {
              baseUrl += ':' + port;
            }
          }
        }
      }
      const wsApiServerBasePath = authConfig.wsApiServerBasePath;
      if (wsApiServerBasePath && baseUrl) {
        baseUrl = pathJoin(baseUrl, wsApiServerBasePath);
      }
      if (baseUrl) {
        const serviceUrl = this.pathFn();
        this.serviceUrl = serviceUrl;
        if (serviceUrl) {
          const url = baseUrl + serviceUrl + this.query;
          //console.log('Websocket using URL: ' + url);
          this.ws = new $WebSocket(url);
          this.connectTime = new Date().getTime();

          this.subscription = this.ws.getDataStream().subscribe(
            (msg) => {
              if (validMessage(msg)) {
                this.retries = 0;
                this.connectTime = new Date().getTime();
              }
              this._dataStream.next(msg);
            },
            (err) => {
              console.log('WebSocket error on ' + serviceUrl, err);
              // lets not send the websocket error as we will downgrade to polling
              //this._dataStream.error(err);
              this.onWebSocketError();
            },
            () => {
              this.retries = 0;
              this.connectTime = new Date().getTime();
              this.recreate();
            },
          );
        }
      } else {
        console.log("Cannot figure out the base URL so we can't watch this resource!");
      }
    }
  }

  protected onWebSocketError() {
    //if (this.retries < 3 && this.connectTime && (new Date().getTime() - this.connectTime) > 5000) {
    if (this.retries < 3) {
      this.retries = this.retries + 1;
      this.recreate();
    } else {
      console.log(
        'WebSocket for ' +
          this.pathFn() +
          ' error, retry #' +
          this.retries +
          ' so switching to polling mode',
      );
      this.closeWebSocket();
      this.lazyCreatePoller();
    }
  }

  protected lazyCreatePoller() {
    if (!this.poller) {
      this.poller = this.pollerFactory.newInstance(this.listFactory, this._dataStream);
    }
  }

  // TODO
  ngOnDestroy(): void {
    this.closeWebSocket();
  }
}

function validMessage(msg): boolean {
  if (msg != undefined) {
    for (const key of msg) {
      return true;
    }
  }
  return false;
}
