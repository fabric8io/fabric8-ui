import { Component, Input, OnInit } from '@angular/core';
import { debounce, isNumber } from 'lodash';
import { Observable } from 'rxjs';

import { DeploymentsService } from '../services/deployments.service';
import { Pods } from '../models/pods';
import { Environment } from '../models/environment';

@Component({
  selector: 'deployments-donut',
  templateUrl: './deployments-donut.component.html',
  styleUrls: ['./deployments-donut.component.less']
})
export class DeploymentsDonutComponent implements OnInit {

  @Input() mini: boolean;
  @Input() spaceId: string;
  @Input() applicationId: string;
  @Input() environment: Environment;

  isIdled = false;
  scalable = true;
  pods: Observable<Pods>;
  desiredReplicas: number;
  debounceScale = debounce(this.scale, 650);

  colors = {
    'Empty': '#ffffff', // black
    'Running': '#00b9e4', // dark blue
    'Not Ready': '#beedf9', // light blue
    'Warning': '#f39d3c', // orange
    'Error': '#d9534f', // red
    'Pulling': '#d1d1d1', // grey
    'Pending': '#ededed', // light grey
    'Succeeded': '#3f9c35', // green
    'Terminating': '#00659c', // dark blue
    'Unknown': '#f9d67a' // light yellow
  };

  private replicas: number;

  constructor(
    private deploymentsService: DeploymentsService
  ) { }

  ngOnInit(): void {
    this.pods = this.deploymentsService.getPods(this.spaceId, this.applicationId, this.environment.name);
    this.pods.subscribe(pods => this.replicas = pods.total);

    this.desiredReplicas = this.getDesiredReplicas();
  }

  scaleUp(): void {
    if (!this.scalable) {
      return;
    }
    let desired = this.getDesiredReplicas();
    this.desiredReplicas = desired + 1;

    this.debounceScale();
  }

  scaleDown(): void {
    if (!this.scalable) {
      return;
    }

    if (this.getDesiredReplicas() === 0) {
      return;
    }

    let desired = this.getDesiredReplicas();
    this.desiredReplicas = desired - 1;

    this.debounceScale();
  }

  getDesiredReplicas(): number {
    if (isNumber(this.desiredReplicas)) {
      return this.desiredReplicas;
    }

    if (this.replicas) {
      return this.replicas;
    }

    return 1;
  }

  private scale(): void {
    this.deploymentsService.scalePods(
      this.spaceId, this.environment.name, this.applicationId, this.desiredReplicas
    );
  }
}
