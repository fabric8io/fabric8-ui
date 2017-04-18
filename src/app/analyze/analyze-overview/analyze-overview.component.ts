import { Component, OnInit, ViewChild } from '@angular/core';
import { IWorkflow } from './models/workflow';
import { IModalHost } from '../../space-wizard/models/modal-host';
import { SpaceWizardComponent } from '../../space-wizard/space-wizard.component';
import { Context, Contexts } from 'ngx-fabric8-wit';

@Component({
  selector: 'alm-analyzeOverview',
  templateUrl: 'analyze-overview.component.html',
  styleUrls: ['./analyze-overview.component.scss']
})
export class AnalyzeOverviewComponent implements OnInit {

  @ViewChild('updateSpace') updateSpace: IModalHost;
  @ViewChild('spaceWizard') spaceWizard: SpaceWizardComponent;
  private _context: Context;

  constructor(
    private contexts: Contexts
  ) {

  }
  ngOnInit() {
    this.contexts.current.subscribe(val => {
      this._context = val;
    });
  }

  openForgeWizard() {
    this.updateSpace.open();
    this.spaceWizard.configurator.space = this._context.space;
    this.spaceWizard.workflow.gotoStep('forge-step');
  }

}
