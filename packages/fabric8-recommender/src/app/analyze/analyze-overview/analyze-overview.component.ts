import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-login-client';

import { ContextService } from '../../shared/context.service';

@Component({
  selector: 'alm-analyzeOverview',
  templateUrl: 'analyze-overview.component.html',
  styleUrls: ['./analyze-overview.component.scss']
})
export class AnalyzeOverviewComponent implements OnInit {

  imgLoaded: Boolean = false;


  constructor(
    private router: Router,
    public context: ContextService,
    private broadcaster: Broadcaster
  ) {
  }

  ngOnInit() {

  }

  onImgLoad() {
    this.imgLoaded = true;
  }

  saveDescription() {
    this.broadcaster.broadcast('save', 1);
  }

}
