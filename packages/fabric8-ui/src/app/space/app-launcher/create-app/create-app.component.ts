import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Broadcaster, Notifications, NotificationType } from 'ngx-base';
import { DependencyCheck, Projectile } from 'ngx-launcher';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CheService } from '../../create/codebases/services/che.service';
import { WorkspacesService } from '../../create/codebases/services/workspaces.service';

type QueryJson = {
  q: string;
};
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-create-app',
  templateUrl: './create-app.component.html',
})
export class CreateAppComponent implements OnDestroy, OnInit {
  subscriptions: Subscription[] = [];

  projectName: string;

  constructor(
    private cheService: CheService,
    private notifications: Notifications,
    private route: ActivatedRoute,
    private router: Router,
    private broadcaster: Broadcaster,
    private projectile: Projectile<DependencyCheck>,
    private workSpacesService: WorkspacesService,
  ) {}

  ngOnInit() {
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'create app opened',
    });
  }

  ngOnDestroy(): void {
    this.projectile.resetState();
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  /**
   * Helper to cancel and route back to space
   */
  cancel($event: any): void {
    this.router.navigate(['../../../'], { relativeTo: this.route });
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'create app closed',
    });
  }

  /**
   * Helper to complete and route back to space
   */
  complete(): void {
    this.router.navigate(['../../../'], { relativeTo: this.route });
  }

  addQuery(): QueryJson {
    this.projectName = this.projectile.sharedState.state.projectName;
    const query = `{"application":["${this.projectName}"]}`;
    return {
      q: query,
    };
  }

  createWorkSpace(): void {
    const codeBaseId = this.projectile.sharedState.state.codebaseId;
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'Create app flow open in IDE button clicked',
    });
    this.subscriptions.push(
      this.cheService
        .getState()
        .pipe(
          switchMap((che) => {
            if (!che.clusterFull) {
              return this.workSpacesService.createWorkspace(codeBaseId).pipe(
                map((workSpaceLinks) => {
                  window.open(workSpaceLinks.links.open, '_blank');
                }),
              );
            }
            this.notifications.message({
              message: `Che cluster is full`,
              type: NotificationType.WARNING,
            });
          }),
        )
        .subscribe(),
    );
  }

  viewPipeline(): void {
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'Create app flow View pipeline button clicked',
    });
  }
}
