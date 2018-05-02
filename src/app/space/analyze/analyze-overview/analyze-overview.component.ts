import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';

import { Broadcaster } from 'ngx-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Context, Contexts, Space } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { ConnectableObservable, Subscription } from 'rxjs';

import { FeatureTogglesService } from '../../../feature-flag/service/feature-toggles.service';

import { IWorkflow } from './models/workflow';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-analyzeOverview',
  templateUrl: 'analyze-overview.component.html',
  styleUrls: ['./analyze-overview.component.less']
})
export class AnalyzeOverviewComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private loggedInUser: User;
  context: Context;
  private selectedFlow: string;
  private space: Space;
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService,
    private broadcaster: Broadcaster,
    private authentication: AuthenticationService,
    private contexts: Contexts,
    private userService: UserService
  ) {
    this.selectedFlow = 'selectFlow';
  }

  ngOnInit() {
    this.subscriptions.push(this.contexts.current.subscribe((ctx: Context) => {
      this.context = ctx;
      this.space = ctx.space;
    }));

    this.subscriptions.push(this.userService.loggedInUser.subscribe((user: User) => {
      this.loggedInUser = user;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  openForgeWizard(addSpace: TemplateRef<any>) {
    if (this.authentication.getGitHubToken()) {
      this.selectedFlow = 'selectFlow';
      this.modalRef = this.modalService.show(addSpace, { class: 'modal-lg' });
    } else {
      this.broadcaster.broadcast('showDisconnectedFromGitHub', { 'location': window.location.href });
    }
  }

  closeModal($event: any): void {
    this.modalRef.hide();
  }

  selectFlow($event) {
    this.selectedFlow = $event.flow;
  }

  showAddAppOverlay(): void {
    this.broadcaster.broadcast('showAddAppOverlay', true);
  }

  userOwnsSpace(): boolean {
    if (this.context && this.loggedInUser) {
      return this.context.space.relationships['owned-by'].data.id === this.loggedInUser.id;
    }
    return false;
  }
}
