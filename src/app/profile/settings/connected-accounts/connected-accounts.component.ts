import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProviderService } from '../../../shared/account/provider.service';
import { TenantService } from '../../services/tenant.service';

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
  gitHubUserName: string;
  gitHubError: string;
  openShiftLinked: boolean = false;
  openShiftUserName: string;
  openShiftError: string;

  userName: string;
  contextUserName: string;
  cluster: string;
  consoleUrl: string;
  clusterName: string;

  constructor(
    private contexts: Contexts,
    private auth: AuthenticationService,
    private userService: UserService,
    private providerService: ProviderService,
    private tenantService: TenantService
  ) {
    this.subscriptions.push(auth.gitHubToken.subscribe(token => {
      this.gitHubLinked = (token !== undefined && token.length !== 0);
    }));
    this.subscriptions.push(contexts.current.subscribe(val => {
      this.contextUserName = val.user.attributes.username;
    }));

    if (userService.currentLoggedInUser.attributes) {
      let user = userService.currentLoggedInUser;
      this.subscriptions.push(auth.isOpenShiftConnected(user.attributes.cluster).subscribe(isConnected => {
        this.openShiftLinked = isConnected;
      }));
      this.cluster = user.attributes.cluster;
    }

    this.subscriptions.push(this.tenantService.getTenant()
      .pipe(
        map(data => data.attributes.namespaces[0]['cluster-console-url'])
      ).subscribe(url => {
        this.consoleUrl = url;
        this.clusterName = url.split('.')[1];
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.userName = '';
    this.updateGitHubStatus();
    this.updateOpenShiftStatus();
  }

  public disconnectGitHub(): void {
    this.providerService.disconnectGitHub().subscribe(() => {
      this.gitHubLinked = false;
      this.gitHubError = 'Disconnected';
    });
  }

  public refreshGitHub(): void {
    // call linking api again to reconnect if a connection doesn't exist
    this.connectGitHub();
  }

  public connectGitHub(): void {
    this.providerService.linkGitHub(window.location.href);
  }

  public connectOpenShift(): void {
    this.providerService.linkOpenShift(this.cluster, window.location.href);
  }

  public refreshOpenShift(): void {
    this.connectOpenShift();
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

  private updateOpenShiftStatus(): void {
    this.providerService.getOpenShiftStatus(this.cluster).subscribe((result) => {
      this.openShiftLinked = true;
      this.openShiftUserName = result.username;
    }, (error) => {
      this.openShiftError = 'Not Connected';
      this.openShiftLinked = false;
    });
  }
}
