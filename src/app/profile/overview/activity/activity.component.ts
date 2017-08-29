import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Context, Contexts } from 'ngx-fabric8-wit';
import { UserService, User } from 'ngx-login-client';

export class Activity {
  what: string;
  when: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-activity',
  templateUrl: './activity.component.html'
})
export class ActivityComponent implements OnDestroy, OnInit  {
  activityItems: any[] = [];
  context: Context;
  loggedInUser: User;
  subscriptions: Subscription[] = [];

  constructor(
      private contexts: Contexts,
      private userService: UserService,
      private router: Router) {
    this.subscriptions.push(contexts.current.subscribe(val => this.context = val));
    this.subscriptions.push(userService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
    }));
  }

  ngOnInit(): void {
    /* Todo: "WorkItems, WorkItemLinks and Comments have history -- not in API, but it's stored in the backend"
    this.activityItems = [{
      what: this.context.user.attributes.username + " added BallonPopGame space",
      when: "Just now"
    },{
      what: this.context.user.attributes.username + " started Iteration 23",
      when: "Just now"
    },{
      what: this.context.user.attributes.username + " tagged user2 in a comment on Iteration 23 that is a long string",
      when: "Just now"
    },{
      what:  + "PTNFLY-2100 was assigned to " + this.context.user.attributes.username,
      when: "Just now"
    }] as Activity[];
    */
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  // Actions

  routeToHome(): void {
    this.router.navigate(['/', '_home']);
  }

  // Private

}
