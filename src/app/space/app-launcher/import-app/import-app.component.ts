import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Context, Space } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';

import { ContextService } from 'app/shared/context.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-import-app',
  templateUrl: './import-app.component.html'
})
export class ImportAppComponent implements OnDestroy, OnInit {
  currentSpace: Space;
  loggedInUser: User;
  spaces: Space[] = [];
  subscriptions: Subscription[] = [];

  constructor(private context: ContextService,
              private userService: UserService,
              private router: Router) {
    this.subscriptions.push(userService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
    }));
    this.subscriptions.push(context.current.subscribe((ctx: Context) => {
      this.currentSpace = ctx.space;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {
  }

  /**
   * Helper to cancel and route back to space
   */
  cancel($event: any): void {
    this.router.navigate(['/', this.loggedInUser.attributes.username, this.currentSpace.attributes.name]);
  }

  /**
   * Helper to complete and route back to space
   */
  complete(): void {
    this.router.navigate(['/', this.loggedInUser.attributes.username, this.currentSpace.attributes.name]);
  }
}
