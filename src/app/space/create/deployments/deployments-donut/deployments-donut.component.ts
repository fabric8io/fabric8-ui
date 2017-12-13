import { Component, Input, OnInit } from '@angular/core';
import { debounce, isNumber } from 'lodash';
import { Observable } from 'rxjs';

import { DeploymentsService } from '../services/deployments.service';
import { Pods } from '../models/pods';

@Component({
  selector: 'deployments-donut',
  templateUrl: './deployments-donut.component.html',
  styleUrls: ['./deployments-donut.component.less']
})
export class DeploymentsDonutComponent implements OnInit {

  @Input() mini: boolean;
  @Input() spaceId: string;
  @Input() applicationId: string;
  @Input() environmentId: string;

  isIdled = false;
  scalable = true;
  pods: Observable<Pods>;
  desiredReplicas: number;
  debounceScale = debounce(this.scale, 650);


  private replicas: number;

  constructor(
    private deploymentsService: DeploymentsService
  ) { }

  ngOnInit(): void {
    this.pods = this.deploymentsService.getPods(this.spaceId, this.environmentId, this.applicationId);
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
    this.deploymentsService.scalePods(this.spaceId, this.environmentId, this.applicationId, this.desiredReplicas);
  }
}
