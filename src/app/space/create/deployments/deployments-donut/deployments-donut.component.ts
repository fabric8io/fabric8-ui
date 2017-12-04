import { Component, Input, OnInit } from '@angular/core';
import { debounce } from 'lodash';

@Component({
  selector: 'deployments-donut',
  templateUrl: './deployments-donut.component.html',
  styleUrls: ['./deployments-donut.component.less']
})
export class DeploymentsDonutComponent implements OnInit {

  @Input() mini: boolean;
  @Input() applicationId: string;

  isIdled = false;
  scalable = true;
  pods: any;
  desiredReplicas: number;

  private scaleRequestPending = false;
  private debounceScale = debounce(this.scale, 650);

  constructor() { }

  ngOnInit(): void {
    this.pods = this.getPods();
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
    if (this.desiredReplicas) {
      return this.desiredReplicas;
    }

    // TODO: acquire replicas from service

    return 1;
  }

  private scale(): void {
    // TODO: send service request to scale
  }

  private getPods(): any {
    return [{
      status: {
        phase: 'Running'
      }
    }, {
      status: {
        phase: 'Terminating'
      }
    }];
  }

}
