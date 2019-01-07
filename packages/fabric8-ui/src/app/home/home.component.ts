import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User, UserService, AuthenticationService } from 'ngx-login-client';
import { first } from 'rxjs/operators';
import { UserSpacesService } from '../shared/user-spaces.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderService } from '../shared/account/provider.service';
import { Subscription } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  providers: [UserSpacesService],
})
export class HomeComponent implements OnInit {
  loggedInUser: User;
  spacesCount: number = -1;
  openShiftLinked: boolean = false;
  subscriptions: Subscription[] = [];
  errorConnecting: boolean = false;
  loading: boolean = true;

  constructor(
    private readonly userService: UserService,
    private readonly userSpacesService: UserSpacesService,
    private readonly auth: AuthenticationService,
    private readonly route: ActivatedRoute,
    private readonly providerService: ProviderService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.loggedInUser = this.userService.currentLoggedInUser;
    let userSpaceCount = this.userSpacesService
      .getInvolvedSpacesCount()
      .pipe(first())
      .subscribe(
        (spacesCount: number): void => {
          this.spacesCount = spacesCount;
          if (this.loggedInUser.attributes && this.loggedInUser.attributes.cluster) {
            this.linkOpenshiftAccounts();
          }
        },
      );
    this.subscriptions.push(userSpaceCount);
  }

  linkOpenshiftAccounts() {
    this.loading = true;
    let connectionSub = this.auth
      .isOpenShiftConnected(this.loggedInUser.attributes.cluster)
      .subscribe((isConnected) => {
        this.openShiftLinked = isConnected;
        console.log('connection', this.openShiftLinked);
        let wait = this.route.snapshot.queryParams['wait'];
        if (!isConnected && !wait) {
          // first time through and user isn't connected - automatically connect accounts
          this.providerService.linkOpenShift(
            this.loggedInUser.attributes.cluster,
            window.location.origin + '/_home?wait=true',
          );
        } else if (!isConnected && wait) {
          // second time through - do not try again if wait is on URL and the user is still not connected
          // something happened, show error
          this.errorConnecting = true;
          this.loading = false;
        } else {
          // success - user is connected - send home
          this.loading = false;
          this.router.navigateByUrl('_home', { queryParams: {} });
        }
      });
    this.subscriptions.push(connectionSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
