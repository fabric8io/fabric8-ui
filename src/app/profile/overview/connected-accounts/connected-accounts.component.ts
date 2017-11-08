import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { Context, Contexts } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Observable';
import { Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService, User } from 'ngx-login-client';

import { ProviderService } from '../../../getting-started/services/provider.service';
import { Fabric8UIConfig } from '../shared/config/fabric8-ui-config';
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

  userName: string;
  contextUserName: string;
  githubUserName: string;

  constructor(
    private contexts: Contexts,
    private auth: AuthenticationService,
    private gettingStartedService: GettingStartedService,
    private http: Http,
    private providerService: ProviderService,
    private userService: UserService) {
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
    this.userName = '';
  }
}
