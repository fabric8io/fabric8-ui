import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';

import { Broadcaster } from 'ngx-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Context, Contexts, Space } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { Subscription } from 'rxjs';

import { FeatureTogglesService } from '../../../feature-flag/service/feature-toggles.service';

import { IWorkflow } from './models/workflow';

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
    private broadcaster: Broadcaster,
    private authentication: AuthenticationService,
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
    if (this.authentication.getGitHubToken()) {
      this.selectedFlow = 'selectFlow';
      this.modalRef = this.modalService.show(addSpace, {class: 'modal-lg'});
    } else {
      this.broadcaster.broadcast('showDisconnectedFromGitHub', {'location': window.location.href });
    }
  }

  closeModal($event: any): void {
    this.modalRef.hide();
  }

  selectFlow($event) {
    this.selectedFlow = $event.flow;
  }

}
