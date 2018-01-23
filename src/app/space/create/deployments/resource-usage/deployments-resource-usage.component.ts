import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Environment } from '../models/environment';

@Component({
  selector: 'deployments-resource-usage',
  styleUrls: ['./deployments-resource-usage.component.less'],
  templateUrl: 'deployments-resource-usage.component.html'
})
export class DeploymentsResourceUsageComponent implements OnInit {

  @Input() environments: Observable<Environment[]>;
  @Input() spaceId: Observable<string>;

  private envList: Environment[] = [];

  constructor() { }

  ngOnInit(): void {
    this.environments.subscribe((envs: Environment[]) => {
      console.log('ResUsage ' + JSON.stringify(envs));
      this.envList = envs;
    });
  }

}
