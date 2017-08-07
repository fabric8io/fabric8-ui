import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { IWorkflow } from './models/workflow';
import { IModalHost } from '../../wizard/models/modal-host';
import { SpaceWizardComponent } from '../../wizard/space-wizard.component';
import { Context, Contexts } from 'ngx-fabric8-wit';

import {Subscription } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-analyzeOverview',
  templateUrl: 'analyze-overview.component.html',
  styleUrls: ['./analyze-overview.component.less']
})
export class AnalyzeOverviewComponent implements OnInit, OnDestroy {

  @ViewChild('updateSpace') updateSpace: IModalHost;
  @ViewChild('spaceWizard') spaceWizard: SpaceWizardComponent;
  private _context: Context;
  private contextSubscription: Subscription;

  constructor(
    private contexts: Contexts
  ) {

  }
  ngOnInit() {
    this.contextSubscription = this.contexts.current.subscribe(val => {
      this._context = val;
    });
  }

  ngOnDestroy() {
    this.contextSubscription.unsubscribe();
  }

  openForgeWizard() {
    this.updateSpace.open(this.spaceWizard.steps.spaceConfigurator);
  }

}
