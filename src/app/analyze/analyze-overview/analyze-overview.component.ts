import { Space, Contexts } from 'ngx-fabric8-wit';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-login-client';

@Component({
  selector: 'alm-analyzeOverview',
  templateUrl: 'analyze-overview.component.html',
  styleUrls: ['./analyze-overview.component.scss']
})
export class AnalyzeOverviewComponent {

  imgLoaded: Boolean = false;

  space: Space;

  constructor(
    private router: Router,
    context: Contexts,
    private broadcaster: Broadcaster
  ) {
    context.current.subscribe(val => this.space = val.space);
  }

  onImgLoad() {
    this.imgLoaded = true;
  }

  saveDescription() {
    this.broadcaster.broadcast('save', 1);
  }

}
