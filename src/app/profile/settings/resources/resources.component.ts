import { Component, InjectionToken, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { ResourceService, UsageSeverityEnvironmentStat } from '../services/resource.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'resources-component',
  templateUrl: 'resources.component.html',
  styleUrls: ['./resources.component.less'],
  providers: [
    ResourceService
  ]
})
export class ResourcesComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  data: UsageSeverityEnvironmentStat[];

  constructor(
    private resourceService: ResourceService
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.resourceService.getEnvironmentsWithScaleAndIcon().subscribe(
      (stats: UsageSeverityEnvironmentStat[]) => { this.data = stats; }
    ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
