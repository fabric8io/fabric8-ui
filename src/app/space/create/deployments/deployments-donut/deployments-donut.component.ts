import { Component, Input, OnInit } from '@angular/core';

import { debounce, isNumber } from 'lodash';
import { NotificationType } from 'ngx-base';
import { Observable } from 'rxjs';

import { Environment } from '../models/environment';

import { NotificationsService } from 'app/shared/notifications.service';
import { Pods } from '../models/pods';
import { DeploymentsService } from '../services/deployments.service';

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
    'Empty': '#fafafa', // pf-black-100
    'Running': '#00b9e4', // pf-light-blue-400
    'Not Ready': '#beedf9', // pf-light-blue-100
    'Warning': '#f39d3c', // pf-orange-300
    'Error': '#cc0000', // pf-red-100
    'Pulling': '#d1d1d1', // pf-black-300
    'Pending': '#ededed', // pf-black-200
    'Succeeded': '#3f9c35', // pf-green-400
    'Terminating': '#00659c', // pf-blue-500
    'Unknown': '#f9d67a' // pf-gold-200
  };

  private replicas: number;

  constructor(
    private deploymentsService: DeploymentsService,
    private notifications: NotificationsService
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
    ).first().subscribe(
      success => {
        // Do nothing
      },
      error => {
        this.notifications.message({
          type: NotificationType.WARNING,
          message: error
        });
      }
    );
  }
}
