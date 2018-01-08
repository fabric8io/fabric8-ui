import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Context, Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';

import { ProviderService } from '../../../shared/account/provider.service';
import { Fabric8UIConfig } from '../shared/config/fabric8-ui-config';

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
  gitHubUserName: string;
  gitHubError: string;

  userName: string;
  contextUserName: string;
  cluster: string;

  constructor(private contexts: Contexts,
              private auth: AuthenticationService,
              private userService: UserService,
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

    this.subscriptions.push(userService.loggedInUser.subscribe(user => {
      if (user.attributes) {
        this.cluster = user.attributes['cluster'];
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.userName = '';
    this.updateGitHubStatus();
  }

  public disconnectGitHub(): void {
    this.providerService.disconnectGitHub().subscribe(() => {
      this.gitHubLinked = false;
      this.gitHubError = 'Disconnected';
    });
  }

  public connectGitHub(): void {
    this.providerService.linkGitHub(window.location.href);
  }

  public connectOpenShift(): void {
    this.providerService.linkOpenShift(window.location.href);
  }

  public refreshGitHub(): void {
    // call linking api again to reconnect if a connection doesn't exist
    this.connectGitHub();
  }

  public refreshOpenShift(): void {
    this.providerService.disconnectOpenShift(this.cluster).subscribe(() => {
      this.connectOpenShift();
    });
  }

  private updateGitHubStatus(): void {
    this.providerService.getGitHubStatus().subscribe((result) => {
      this.gitHubLinked = true;
      this.gitHubUserName = result.username;
    }, (error) => {
      this.gitHubError = 'Disconnected';
      this.gitHubLinked = false;
    });
  }
}
