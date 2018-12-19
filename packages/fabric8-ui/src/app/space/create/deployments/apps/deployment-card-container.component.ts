import { Component, Input } from '@angular/core';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { DeploymentsService } from '../services/deployments.service';

@Component({
  selector: 'deployment-card-container',
  templateUrl: 'deployment-card-container.component.html',
  styleUrls: ['./deployment-card-container.component.less'],
})
export class DeploymentCardContainerComponent {
  @Input() spaceId: string;
  @Input() spaceName: string;
  @Input() environments: Observable<string[]>;
  @Input() applications: string[];

  collapsed: Map<string, boolean> = new Map<string, boolean>();
  hasDeployments: Observable<boolean>;
  spacePath: Observable<string>;
  username: Observable<string>;

  constructor(
    private readonly contexts: Contexts,
    private readonly deploymentsService: DeploymentsService,
  ) {}

  ngOnInit(): void {
    this.spacePath = this.contexts.current.pipe(map((c: Context): string => c.path));
    this.username = this.contexts.current.pipe(
      map((c: Context): string => c.user.attributes.username),
    );
    this.hasDeployments = this.environments.pipe(
      mergeMap(
        (environments: string[]): Observable<boolean> =>
          this.deploymentsService.hasDeployments(this.spaceId, environments),
      ),
    );
    this.applications.forEach(
      (app: string): void => {
        this.collapsed[app] = true;
      },
    );
  }
}
