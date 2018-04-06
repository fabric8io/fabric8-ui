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
  isProjectNameValid: boolean;
  loggedInUser: User;
  projectName: string = '';
  selectedFlow: string = '';
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
   * Helper to update launcher selection
   */
  updateLauncherFlowSelection(selLaunch: string): void {
    this.selectedFlow = selLaunch;
  }

  /**
   * Helper to route to create/import app
   */
  routeToLaunchApp(): void {
    this.router.navigate(['/',
      this.loggedInUser.attributes.username, this.currentSpace.attributes.name,
      'applauncher', this.selectedFlow, this.projectName]);
    this.hideAddAppOverlay();
  }

  /**
   * Validate the application name
   */
  validateProjectName(): void {
    this.isProjectNameValid =
      this.dependencyCheckService.validateProjectName(this.projectName);
  }
}
