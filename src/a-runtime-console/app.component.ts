import {Component, ChangeDetectionStrategy, AfterViewInit, OnInit, ViewEncapsulation} from "@angular/core";
import {OAuthService} from "angular2-oauth2/oauth-service";
import {OAuthConfigStore} from "./kubernetes/store/oauth-config-store";
import {Observable} from "rxjs";
import {OnLogin} from "./shared/onlogin.service";
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from './shared/login.service';
// import { jquery as $ } from 'jquery';

@Component({
  host:{
    'class':'app app-component flex-container in-column-direction flex-grow-1'
  },
  selector: 'f8-app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AppComponent implements OnInit, AfterViewInit {
  name = 'Fabric8 Console';

  title = 'Fabric8 Console';
  url = 'https://www.twitter.com/fabric8io';

  constructor(private oauthService: OAuthService,
              private oauthConfigStore: OAuthConfigStore,
              private onLogin: OnLogin,
              private activatedRoute: ActivatedRoute,
              private loginService: LoginService,
              private router: Router) {

    // change this to false to use platform authentication directly instead of the custom openshift oauth
    this.loginService.useCustomAuth = true;

    // set the scope for the permissions the client should request
    this.oauthService.scope = "user:full";

    // set to true, to receive also an id_token via OpenId Connect (OIDC) in addition to the
    // OAuth2-based access_token
    // setting to true doesn't work with openshift oauth
    this.oauthService.oidc = false;

    // Use setStorage to use sessionStorage or another implementation of the TS-type Storage
    // instead of localStorage
    this.oauthService.setStorage(localStorage);
//    this.oauthService.setStorage(sessionStorage);

    this.oauthService.redirectUri = window.location.origin;
    this.oauthService.clientId = "fabric8";
  }

  ngOnInit(): void {
  }


  protected configureOAuth() {
  }


  ngAfterViewInit() {
    if(!this.loginService.useCustomAuth) {
      this.activatedRoute.params.subscribe(() => {
        this.loginService.login();
      });
    } else {
      var token = "";
      if (this.oauthConfigStore.config.authorizeUri) {
        token = this.checkLoggedIn();
      }
      if (!token) {
        this.oauthConfigStore.resource.subscribe(config => {
          var authorizeUri = config.authorizeUri;
          if (authorizeUri) {
            //console.log("OAuthConfig loaded with URI: " + authorizeUri);
            this.checkLoggedIn();
          }
        });
      }
    }
  }

  protected checkLoggedIn() {
    let config = this.oauthConfigStore.config;
    let issuer = config.issuer;
    let clientId = config.clientId || "fabric8";
    let scope = config.scope || "user:full";

    this.oauthService.scope = scope;
    this.oauthService.loginUrl = config.authorizeUri;
    this.oauthService.issuer = issuer;
    this.oauthService.clientId = clientId;
    //this.oauthService.logoutUrl = config.logoutUri;

    console.log("Logging in with client " + clientId + " scope " + scope + " and issuer " + issuer);

    let token = this.oauthService.getAccessToken();
    if (this.oauthService.hasValidAccessToken()) {
      console.log("has valid OAuth token from auth URI: " + config.authorizeUri);
      this.onLogin.onLogin(token);
    } else {
      //console.log("not yet got a valid OAuth token at auth URI: " + config.authorizeUri);
      token = null;
      this.onLogin.onLogin("");
    }

    if (token) {
      // lets setup a timer for when the token expires

      // TODO when this code is merged:
      // https://github.com/manfredsteyer/angular2-oauth2/issues/25
      // lets use:
      //
      //let expiresAt = this.oauthService.expiresAt;
      let expires = expiresAt();
      if (expires) {
        console.log("The token expires at " + expires);
        Observable.timer(expires).subscribe(() => {
          console.log("OAuth token has expired so lets login again");
          if (!this.oauthService.tryLogin({
              onTokenReceived: context => {
                if (context) {
                  token = context.accessToken;

                  if (this.oauthService.hasValidAccessToken()) {
                    console.log("has valid OAuth token!");
                    this.onLogin.onLogin(token);
                  }
                }
              }
            })) {
            this.oauthService.initImplicitFlow();
          }
        });
      }
    }
    if (!token) {
      if (config.authorizeUri) {
        if (!this.oauthService.tryLogin({
            onTokenReceived: context => {
              if (context) {
                token = context.accessToken;
                if (this.oauthService.hasValidAccessToken()) {
                  console.log("has valid OAuth token!");
                  this.onLogin.onLogin(token);
                }
              }
            }
          })) {
          this.oauthService.initImplicitFlow();
        }
      } else {
        console.log("No OAuth URI!");
      }
    }
    return token;
  }
}

function expiresAt(): Date {
  var expiresAt = localStorage.getItem("expires_at");
  if (expiresAt) {
      var i = parseInt(expiresAt);
      if (i) {
          return new Date(i);
      }
  }
  return null;
}
