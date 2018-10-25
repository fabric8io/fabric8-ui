import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { Broadcaster } from 'ngx-base';
import { Context, Space } from 'ngx-fabric8-wit';
import { FeatureTogglesService } from 'ngx-feature-flag';
import { DependencyCheck, Projectile } from 'ngx-launcher';
import { User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ContextService } from '../../../shared/context.service';
import { CheService } from './../../create/codebases/services/che.service';
import { WorkspacesService } from './../../create/codebases/services/workspaces.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-create-app',
  templateUrl: './create-app.component.html'
})
export class CreateAppComponent implements OnDestroy, OnInit {
  currentSpace: Space;
  loggedInUser: User;
  spaces: Space[] = [];
  subscriptions: Subscription[] = [];
  codeBaseId: string;

  constructor(private context: ContextService,
              private cheService: CheService,
              private userService: UserService,
              private router: Router,
              private broadcaster: Broadcaster,
              private  featureToggleService: FeatureTogglesService,
              private projectile: Projectile<DependencyCheck>,
              private workSpacesService: WorkspacesService) {
    this.subscriptions.push(userService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
    }));
    this.subscriptions.push(context.current.subscribe((ctx: Context) => {
      this.currentSpace = ctx.space;
    }));
  }

  ngOnInit() {
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'create app opened'
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  /**
   * Helper to cancel and route back to space
   */
  cancel($event: any): void {
    this.router.navigate(['/', this.loggedInUser.attributes.username, this.currentSpace.attributes.name]);
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'create app closed'
    });
  }

  /**
   * Helper to complete and route back to space
   */
  complete(): void {
    this.router.navigate(['/', this.loggedInUser.attributes.username, this.currentSpace.attributes.name]);
  }

  addQuery() {
    const query = '{\"application\":[\"' + this.projectile.sharedState.state.projectName + '\"]}';
    return {
      q: query
    };
  }

  createWorkSpace() {
    const codeBaseId = this.projectile.sharedState.state.codebaseId;
    this.subscriptions.push(this.cheService.getState().pipe(switchMap(che => {
      if (!che.clusterFull) {
        return this.workSpacesService.createWorkspace(codeBaseId)
          .pipe(map(workSpaceLinks => {
            window.open(workSpaceLinks.links.open, '_blank');
          }));
      }
    })).subscribe());
  }
}
