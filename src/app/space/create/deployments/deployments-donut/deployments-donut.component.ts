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
  private debounceScale: () => void;

  constructor() { }

  ngOnInit(): void {
    this.debounceScale = debounce(this.scale, 650);
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

    if (0 === this.getDesiredReplicas()) {
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
    console.log('scale call');
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
