import {
  Component,
  Input
} from '@angular/core';

import { Contexts } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';

import { DeploymentsService } from '../services/deployments.service';

@Component({
  selector: 'deployment-card-container',
  templateUrl: 'deployment-card-container.component.html',
  styleUrls: ['./deployment-card-container.component.less']
})
export class DeploymentCardContainerComponent {
  @Input() spaceId: string;
  @Input() spaceName: string;
  @Input() environments: Observable<string[]>;
  @Input() applications: string[];
  collapsed: Map<string, boolean> = new Map<string, boolean>();
  private hasDeployments: Observable<boolean>;
  private spacePath: Observable<string>;
  private username: Observable<string>;

  constructor(
    private contexts: Contexts,
    private deploymentsService: DeploymentsService
  ) {}

  ngOnInit(): void {
    this.spacePath = this.contexts.current.pipe(map(c => c.path));
    this.username = this.contexts.current.pipe(map(c => c.user.attributes.username));
    this.hasDeployments = this.environments.pipe(mergeMap(
      (environments: string[]): Observable<boolean> =>
        this.deploymentsService.hasDeployments(this.spaceId, environments)
    ));
    this.applications.forEach(app => {
      this.collapsed[app] = true;
    });
  }
}
