import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Injectable, Inject } from '@angular/core';

import { Context, Contexts } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Observable';
import { Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService, User, AUTH_API_URL } from 'ngx-login-client';

import { ProviderService } from '../../../getting-started/services/provider.service';
import { Fabric8UIConfig } from '../../../shared/config/fabric8-ui-config';
import { Http, Headers, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { ExtUser, GettingStartedService } from '../../../getting-started/services/getting-started.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-connected-accounts',
  templateUrl: './connected-accounts.component.html',
  styleUrls: ['./connected-accounts.component.less'],
  providers: [ GettingStartedService, ProviderService ]
})
export class ConnectedAccountsComponent implements OnDestroy, OnInit {
  context: Context;
  subscriptions: Subscription[] = [];
  // contextSubscription: Subscription;

  authOpenShift: boolean = false;
  gitHubLinked: boolean = false;
  openShiftLinked: boolean = false;
  
  loggedInUser: User;
  username: string;
  accessToken: string;
  redirect: string;
  linkingApiURL: string;
  unlinkingApiURL: string;

  contextUserName: string;
  githubUserName: string;

  constructor(
    private contexts: Contexts,
    private auth: AuthenticationService,
    private gettingStartedService: GettingStartedService,
    private http: Http,
    private providerService: ProviderService,
    private fabric8UIConfig: Fabric8UIConfig,
    @Inject(AUTH_API_URL) apiUrl: string,
    private userService: UserService) {
    
    this.linkingApiURL = apiUrl + 'token/link';
    this.unlinkingApiURL = apiUrl + 'token';
    
    // for GitHub
    this.subscriptions.push(auth.gitHubToken.subscribe(token => {
      this.gitHubLinked = (token !== undefined && token.length !== 0);
    }));
    // for OpenShift
    this.subscriptions.push(this.contexts.current.subscribe(val => {
      this.contextUserName = val.user.attributes.username;
    }));
    this.subscriptions.push(auth.openShiftToken.subscribe(token => {
      this.openShiftLinked = (token !== undefined && token.length !== 0);
    }));
  }

  ngOnDestroy(): void {
    // this.contextSubscription.unsubscribe();
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.userService.loggedInUser
      .map(user => {
        this.loggedInUser = user;
        this.username = this.loggedInUser.attributes.username;
        this.accessToken = this.auth.getToken();
        this.redirect = window.location.origin + "/" + this.username;
      })
      .publish().connect();
  }
  
  connectGitHub(): boolean {
    console.log("Connecting GitHub account");
    this.auth.connectGitHub(window.location.origin + "/" + this.username);
    return true;
  }
  
  disconnectGitHub(): boolean {
    console.log("Disconnecting GitHub account");
    this.auth.disconnectGitHub();
    return true;
  }
  
  connectOpenShift(): boolean {
    console.log("Connecting OpenShift account");
    this.auth.connectOpenShift(window.location.origin + "/" + this.username);
    //this.providerService.linkOpenShift(window.location.origin + "/" + this.username);
    return false;
  }
  
  disconnectOpenShift(): boolean {
    console.log("Disconnecting OpenShift account");
    this.auth.disconnectOpenShift(this.fabric8UIConfig.tenantApiUrl);
    return true;
  }
}
