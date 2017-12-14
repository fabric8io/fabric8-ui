import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Context, Contexts } from 'ngx-fabric8-wit';
import { Space, SpaceService } from 'ngx-fabric8-wit';
import { UserService, User } from 'ngx-login-client';
import { ContextService } from '../../shared/context.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent implements OnDestroy, OnInit {
  context: Context;
  loggedInUser: User;
  subscriptions: Subscription[] = [];
  spaces: Space[] = [];
  viewingOwnAccount: boolean;

  constructor(
      private contexts: Contexts,
      private spaceService: SpaceService,
      private userService: UserService,
      private contextService: ContextService,
      private router: Router) {
    this.subscriptions.push(contexts.current.subscribe(val => this.context = val));
    this.subscriptions.push(userService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
      if (user.attributes) {
        this.subscriptions.push(spaceService.getSpacesByUser(user.attributes.username, 10).subscribe(spaces => {
          this.spaces = spaces;
        }));
      }
    }));
  }

  ngOnInit() {
    this.viewingOwnAccount = this.contextService.viewingOwnContext();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  routeToUpdateProfile(): void {
    this.router.navigate(['/', this.context.user.attributes.username, '_update']);
  }
}
