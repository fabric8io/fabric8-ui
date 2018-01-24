import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { debounce, isNumber } from 'lodash';
import { NotificationType } from 'ngx-base';
import { Observable, Subscription } from 'rxjs';

import { Environment } from '../models/environment';

import { NotificationsService } from 'app/shared/notifications.service';
import { Pods } from '../models/pods';
import { DeploymentsService } from '../services/deployments.service';

@Component({
  selector: 'deployments-donut',
  templateUrl: './deployments-donut.component.html',
  styleUrls: ['./deployments-donut.component.less']
})
export class DeploymentsDonutComponent implements OnDestroy, OnInit {

  @Input() mini: boolean;
  @Input() spaceId: Observable<string>;
  @Input() applicationId: string;
  @Input() environment: Environment;

  isIdled = false;
  scalable = true;
  pods: Observable<Pods>;
  desiredReplicas: number = 1;
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
  private scaleRequestPending: boolean = false;
  private subscriptions: Subscription[] = [];
  private spaceIdRef: string;

  constructor(
    private deploymentsService: DeploymentsService,
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void {

    this.subscriptions.push(
      this.spaceId.subscribe((spaceId: string) => {
        this.spaceIdRef = spaceId;
        this.pods = this.deploymentsService.getPods(spaceId, this.applicationId, this.environment.name);
        this.subscriptions.push(this.pods.subscribe(pods => {
            this.replicas = pods.total;
            if (!this.scaleRequestPending) {
              this.desiredReplicas = this.replicas;
            }
          }));
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  scaleUp(): void {
    if (!this.scalable) {
      return;
    }
    let desired = this.desiredReplicas;
    this.desiredReplicas = desired + 1;

    this.debounceScale();
    this.scaleRequestPending = true;
  }

  scaleDown(): void {
    if (!this.scalable) {
      return;
    }

    if (this.desiredReplicas === 0) {
      return;
    }

    let desired = this.desiredReplicas;
    this.desiredReplicas = desired - 1;

    this.debounceScale();
    this.scaleRequestPending = true;
  }

  private scale(): void {
    if (this.spaceIdRef) {
      this.deploymentsService.scalePods(
        this.spaceIdRef, this.environment.name, this.applicationId, this.desiredReplicas
      ).first().subscribe(
        success => {
          this.scaleRequestPending = false;
        },
        error => {
          this.scaleRequestPending = false;
          this.notifications.message({
            type: NotificationType.WARNING,
            message: error
          });
        }
      );
    } else {
      this.notifications.message({
        type: NotificationType.WARNING,
        message: 'Unable to scale. Unknown space'
      });
    }
  }
}
