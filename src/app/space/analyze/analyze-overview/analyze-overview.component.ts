import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation, TemplateRef } from '@angular/core';
import { IWorkflow } from './models/workflow';
import { IModalHost } from '../../wizard/models/modal-host';
import { SpaceWizardComponent } from '../../wizard/space-wizard.component';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {Subscription } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-analyzeOverview',
  templateUrl: 'analyze-overview.component.html',
  styleUrls: ['./analyze-overview.component.less']
})
export class AnalyzeOverviewComponent implements OnInit, OnDestroy {

  //@ViewChild('aaddSpace') updateSpace: IModalHost;
  private _context: Context;
  private contextSubscription: Subscription;
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService,
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

  openForgeWizard(addSpace: TemplateRef<any>) {
    this.modalRef = this.modalService.show(addSpace, {class: 'modal-lg'});
  }
  closeModal($event: any): void {
    this.modalRef.hide();
  }


}
