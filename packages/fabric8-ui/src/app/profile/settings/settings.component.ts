import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: '',
  templateUrl: 'settings.component.html',
  styleUrls: ['./settings.component.less'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  loggedInUserName: String;

  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.userService.loggedInUser.subscribe(
        (user: User): void => {
          if (user.id) {
            this.loggedInUserName = user.attributes.username;
          } else {
            this.loggedInUserName = '';
          }
        },
      ),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }
}
