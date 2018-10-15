import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {

  loggedInUser: User;
  private _loggedInUserSubscription: Subscription;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this._loggedInUserSubscription = this.userService.loggedInUser.subscribe(val => this.loggedInUser = val);
  }

  ngOnDestroy() {
    this._loggedInUserSubscription.unsubscribe();
  }
}
