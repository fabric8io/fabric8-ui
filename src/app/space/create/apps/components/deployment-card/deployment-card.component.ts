import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Observable } from 'rxjs';

import {
  DEPLOYMENTS_SERVICE,
  IDeploymentsService
} from '../../services/deployments.service';
import { Environment } from '../../models/environment';

@Component({
  selector: 'deployment-card',
  templateUrl: 'deployment-card.component.html'
})
export class DeploymentCardComponent implements OnDestroy, OnInit {

  @Input() applicationId: string;
  @Input() environment: Environment;

  collapsed: boolean = true;
  podCount: Observable<number>;
  version: Observable<string>;

  constructor(
    @Inject(DEPLOYMENTS_SERVICE) private deploymentsService: IDeploymentsService
  ) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.podCount =
      this.deploymentsService.getPodCount(this.applicationId, this.environment.environmentId);

    this.version =
      this.deploymentsService.getVersion(this.applicationId, this.environment.environmentId);
  }

}
