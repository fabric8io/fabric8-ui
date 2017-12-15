import { Component, Input, OnInit } from '@angular/core';
import { debounce } from 'lodash';
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


  private scaleRequestPending = false;
  private debounceScale = debounce(this.scale, 650);

  constructor(
    private deploymentsService: DeploymentsService
  ) { }

  ngOnInit(): void {
    this.pods = this.deploymentsService.getPods(this.spaceId, this.applicationId, this.environmentId);
    this.desiredReplicas = this.getDesiredReplicas();
  }

  scaleUp(): void {
    if (!this.scalable) {
      return;
    }
    let desired = this.getDesiredReplicas();
    this.desiredReplicas = desired + 1;

    this.scaleRequestPending = true;
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

    this.scaleRequestPending = true;
    this.debounceScale();
  }

  getDesiredReplicas(): number {
    if (this.desiredReplicas !== undefined) {
      return this.desiredReplicas;
    }

    // TODO: acquire replicas from service

    return 1;
  }

  private scale(): void {
    // TODO: send service request to scale
  }
}
