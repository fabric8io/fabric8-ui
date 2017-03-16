import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Space, Contexts, SpaceService, Spaces } from 'ngx-fabric8-wit';
import { Broadcaster } from 'ngx-base';

import { SpaceNamespaceService } from './../../shared/runtime-console/space-namespace.service';

@Component({
  host: {
    'class': 'cards-pf flex-container'
  },
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
    private spaceService: SpaceService,
    private broadcaster: Broadcaster,
    private spaceNamespaceService: SpaceNamespaceService,
  ) {
    context.current.subscribe(val => this.space = val.space);
  }

  onImgLoad() {
    this.imgLoaded = true;
  }

  saveDescription() {
    this.spaceService.update(this.space);
    this.spaceNamespaceService.updateConfigMap(Observable.of(this.space)).subscribe();
  }

}
