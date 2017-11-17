import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Observable } from 'rxjs';

import { AppsService } from '../../services/deployments.service';
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
    private appsService: AppsService
  ) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.podCount =
      this.appsService.getPodCount(this.applicationId, this.environment.environmentId);

    this.version =
      this.appsService.getVersion(this.applicationId, this.environment.environmentId);
  }

}
