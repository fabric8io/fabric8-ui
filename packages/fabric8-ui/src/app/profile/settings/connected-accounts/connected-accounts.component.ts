import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProviderService } from '../../../shared/account/provider.service';
import { TenantService } from '../../services/tenant.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-connected-accounts',
  templateUrl: './connected-accounts.component.html',
  styleUrls: ['./connected-accounts.component.less'],
})
export class ConnectedAccountsComponent implements OnDestroy, OnInit {
  context: Context;

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

  private readonly subscriptions: Subscription[] = [];

  constructor(
    contexts: Contexts,
    auth: AuthenticationService,
    userService: UserService,
    private readonly providerService: ProviderService,
    private tenantService: TenantService,
  ) {
    this.subscriptions.push(
      auth.gitHubToken.subscribe(
        (token: string): void => {
          this.gitHubLinked = token !== undefined && token.length !== 0;
        },
      ),
    );
    this.subscriptions.push(
      contexts.current.subscribe(
        (val: Context): void => {
          this.contextUserName = val.user.attributes.username;
        },
      ),
    );

    if (userService.currentLoggedInUser.attributes) {
      const user: User = userService.currentLoggedInUser;
      this.subscriptions.push(
        auth.isOpenShiftConnected(user.attributes.cluster).subscribe(
          (isConnected: boolean): void => {
            this.openShiftLinked = isConnected;
          },
        ),
      );
      this.cluster = user.attributes.cluster;
    }

    this.subscriptions.push(
      this.tenantService
        .getTenant()
        .pipe(map((data) => data.attributes.namespaces[0]['cluster-console-url']))
        .subscribe((url) => {
          this.consoleUrl = url;
          this.clusterName = url.split('.')[1];
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.userName = '';
    this.updateGitHubStatus();
    this.updateOpenShiftStatus();
  }

  disconnectGitHub(): void {
    this.providerService.disconnectGitHub().subscribe(
      (): void => {
        this.gitHubLinked = false;
        this.gitHubError = 'Disconnected';
      },
    );
  }

  refreshGitHub(): void {
    // call linking api again to reconnect if a connection doesn't exist
    this.connectGitHub();
  }

  connectGitHub(): void {
    this.providerService.linkGitHub(window.location.href);
  }

  connectOpenShift(): void {
    this.providerService.linkOpenShift(this.cluster, window.location.href);
  }

  refreshOpenShift(): void {
    this.connectOpenShift();
  }

  private updateGitHubStatus(): void {
    this.providerService.getGitHubStatus().subscribe(
      (result: any): void => {
        this.gitHubLinked = true;
        this.gitHubUserName = result.username;
      },
      () => {
        this.gitHubError = 'Disconnected';
        this.gitHubLinked = false;
      },
    );
  }

  private updateOpenShiftStatus(): void {
    this.providerService.getOpenShiftStatus(this.cluster).subscribe(
      (result: any): void => {
        this.openShiftLinked = true;
        this.openShiftUserName = result.username;
      },
      () => {
        this.openShiftError = 'Not Connected';
        this.openShiftLinked = false;
      },
    );
  }
}
