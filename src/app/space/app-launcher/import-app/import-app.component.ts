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
import { Observable, Subscription } from 'rxjs';
import { ContextService } from '../../../shared/context.service';

type QueryJson = {
  q: string
};

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
  nextButtonsEnable: Observable<{} | boolean>;

  constructor(private context: ContextService,
              private userService: UserService,
              private router: Router,
              private broadcaster: Broadcaster,
              private featureToggleService: FeatureTogglesService,
              private projectile: Projectile<DependencyCheck>) {
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
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'import app opened'
    });
    this.nextButtonsEnable = this.featureToggleService.isFeatureUserEnabled('AppLauncher.NextButtons');
  }

  /**
   * Helper to cancel and route back to space
   */
  cancel($event: any): void {
    this.router.navigate(['/', this.loggedInUser.attributes.username, this.currentSpace.attributes.name]);
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'import app closed'
    });
  }

  /**
   * Helper to complete and route back to space
   */
  complete(): void {
    this.router.navigate(['/', this.loggedInUser.attributes.username, this.currentSpace.attributes.name]);
  }

  addQuery(): QueryJson {
    const query = '{\"application\":[\"' + this.projectile.sharedState.state.projectName + '\"]}';
    return {
      q: query
    };
  }

  viewPipeline(): void {
    this.broadcaster.broadcast('ImportFlowViewPipelineButtonClicked',
      {
        projectName: this.projectile.sharedState.state.projectName,
        flow: 'import application'
      }
    );
  }
}
