import { Component, OnInit, OnDestroy, ViewEncapsulation, TemplateRef } from '@angular/core';
import { IWorkflow } from './models/workflow';
import { Context, Contexts, Space } from 'ngx-fabric8-wit';
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

  private _context: Context;
  private contextSubscription: Subscription;
  private selectedFlow: string;
  private space: Space;
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService,
    private contexts: Contexts
  ) {
    this.selectedFlow = 'selectFlow';
  }
  ngOnInit() {
    this.contextSubscription = this.contexts.current.subscribe(val => {
      this._context = val;
      this.space = val.space;
    });
  }

  ngOnDestroy() {
    this.contextSubscription.unsubscribe();
  }

  openForgeWizard(addSpace: TemplateRef<any>) {
    this.selectedFlow = 'selectFlow';
    this.modalRef = this.modalService.show(addSpace, {class: 'modal-lg'});
  }

  closeModal($event: any): void {
    this.modalRef.hide();
  }

  selectFlow($event) {
    this.selectedFlow = $event.flow;
  }

}
