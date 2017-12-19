import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { Context, Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

import { Fabric8UIConfig } from '../shared/config/fabric8-ui-config';
import { ProviderService } from '../../../shared/account/provider.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-connected-accounts',
  templateUrl: './connected-accounts.component.html',
  styleUrls: ['./connected-accounts.component.less']
})
export class ConnectedAccountsComponent implements OnDestroy, OnInit {
  context: Context;
  subscriptions: Subscription[] = [];

  gitHubLinked: boolean = false;
  openShiftLinked: boolean = false;

  userName: string;
  contextUserName: string;

  constructor(private contexts: Contexts,
              private auth: AuthenticationService,
              private providerService: ProviderService) {
    this.subscriptions.push(auth.gitHubToken.subscribe(token => {
      this.gitHubLinked = (token !== undefined && token.length !== 0);
    }));
    this.subscriptions.push(contexts.current.subscribe(val => {
      this.contextUserName = val.user.attributes.username;
    }));
    this.subscriptions.push(auth.openShiftToken.subscribe(token => {
      this.openShiftLinked = (token !== undefined && token.length !== 0);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.userName = '';
  }

  public disconnectGitHub(): void {
    this.providerService.disconnectGitHub().subscribe(() => {  });
  }

  public connectGitHub(): void {
    this.providerService.linkGitHub(window.location.href);
  }

  public refreshGitHub(): void {
    this.providerService.disconnectGitHub().subscribe(() => {
      this.connectGitHub();
    });
  }
}
