import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Broadcaster } from 'ngx-base';
import { DependencyCheck, Projectile } from 'ngx-launcher';
import { Subscription } from 'rxjs';

type QueryJson = {
  q: string
};

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-import-app',
  templateUrl: './import-app.component.html'
})
export class ImportAppComponent implements OnDestroy, OnInit {
  subscriptions: Subscription[] = [];
  projectName: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private broadcaster: Broadcaster,
    private projectile: Projectile<DependencyCheck>) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'import app opened'
    });
  }

  /**
   * Helper to cancel and route back to space
   */
  cancel($event: any): void {
    this.router.navigate(['../../../'], {relativeTo: this.route});
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'import app closed'
    });
  }

  /**
   * Helper to complete and route back to space
   */
  complete(): void {
    this.router.navigate(['../../../'], {relativeTo: this.route});
  }

  addQuery(): QueryJson {
    this.projectName = this.projectile.sharedState.state.projectName;
    const query = '{\"application\":[\"' + this.projectName + '\"]}';
    return {
      q: query
    };
  }

  viewPipeline(): void {
    this.broadcaster.broadcast('analyticsTracker',
      {
        event: 'Import app flow View pipeline button clicked'
      }
    );
  }
}
