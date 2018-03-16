import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';
import { ProviderService } from '../shared/account/provider.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.less'],
  providers: []
})
export class GettingStartedComponent implements OnDestroy, OnInit {

  loggedInUser: User;
  openShiftLinked: boolean = false;
  subscriptions: Subscription[] = [];
  username: string;
  errorConnecting: boolean = false;

  constructor(
      private auth: AuthenticationService,
      private providerService: ProviderService,
      private router: Router,
      private route: ActivatedRoute,
      private userService: UserService) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
   let userSub = this.userService.loggedInUser
     .subscribe((user) => {
       this.loggedInUser = user;
       if (this.loggedInUser && this.loggedInUser.attributes) {
         let connectionSub = this.auth.isOpenShiftConnected(this.loggedInUser.attributes.cluster).subscribe((isConnected) => {
           this.openShiftLinked = isConnected;
           let wait = this.route.snapshot.queryParams['wait'];
           if (!isConnected && !wait) {
             // first time through and user isn't connected - automatically connect accounts
             this.connectAccounts();
           } else if (!isConnected && wait) {
             // second time through - do not try again if wait is on URL and the user is still not connected
             // something happened, show error
             this.errorConnecting = true;
           } else {
             // success - user is connected - send home
             this.routeToHomeIfCompleted();
           }
         });
         this.subscriptions.push(connectionSub);
       }
     });
   this.subscriptions.push(userSub);
  }

  // Actions
  /**
   * Link OpenShift accounts
   */
  connectAccounts(): void {
    this.providerService.linkOpenShift(this.loggedInUser.attributes.cluster, window.location.origin + '/_gettingstarted?wait=true');
  }

  /**
   * Helper to route to home page
   */
  routeToHome(): void {
    this.router.navigate(['/', '_home']);
  }

  /**
   * Log out the user
   */
  logOut(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  /**
   * Helper to determin if we're on the getting started page
   *
   * @returns {boolean} True if the getting started page is shown
   */
  private isGettingStartedPage(): boolean {
    return (this.router.url.indexOf('_gettingstarted') !== -1);
  }

  /**
   * Helper to determine if getting started page should be shown or forward to the home page.
   *
   * @returns {boolean}
   */
  private isUserGettingStarted(): boolean {
    return this.openShiftLinked !== true;
  }

  /**
   * Helper to route to home page if getting started is completed
   */
  private routeToHomeIfCompleted(): void {
    // Check for error on linking (we'll come back here and have no token)
    if (this.isGettingStartedPage() && !this.isUserGettingStarted()) {
      this.routeToHome();
    }
  }
}
