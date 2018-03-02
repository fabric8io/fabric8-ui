import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Broadcaster } from 'ngx-base';
import { Context, Space } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';

import { ContextService } from 'app/shared/context.service';
import { DependencyCheckService } from 'ngx-forge';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-add-app-overlay',
  styleUrls: ['./add-app-overlay.component.less'],
  templateUrl: './add-app-overlay.component.html'
})
export class AddAppOverlayComponent implements OnDestroy, OnInit {
  currentSpace: Space;
  loggedInUser: User;
  projectName: string = '';
  spaces: Space[] = [];
  subscriptions: Subscription[] = [];

  constructor(private context: ContextService,
              private dependencyCheckService: DependencyCheckService,
              private broadcaster: Broadcaster,
              private userService: UserService,
              private router: Router) {
    this.loggedInUser = this.userService.currentLoggedInUser;
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
    this.subscriptions.push(this.dependencyCheckService.getDependencyCheck().subscribe((val) => {
      this.projectName = val.projectName;
    }));
  }

  /**
   * Helper to route to create app
   */
  hideAddAppOverlay(): void {
    this.broadcaster.broadcast('showAddAppOverlay', false);
  }

  /**
   * Helper to route to create app
   */
  routeToCreateApp(): void {
    this.router.navigate(['/',
      this.loggedInUser.attributes.username, this.currentSpace.attributes.name,
      'applauncher', 'createapp', this.projectName]);
    this.hideAddAppOverlay();
  }

  /**
   * Helper to route to create app
   */
  routeToImportApp(): void {
    this.router.navigate(['/',
      this.loggedInUser.attributes.username, this.currentSpace.attributes.name,
      'applauncher', 'importapp', this.projectName]);
    this.hideAddAppOverlay();
  }
}
