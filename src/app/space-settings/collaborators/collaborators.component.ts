import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IModalHost } from '../../space-wizard/models/modal-host';

import { Context, CollaboratorService } from 'ngx-fabric8-wit';

import { User } from 'ngx-login-client';
import { ListViewConfig, EmptyStateConfig } from 'ngx-widgets';

import { ContextService } from '../../shared/context.service';
import { find } from 'lodash';

@Component({
  selector: 'alm-collaborators',
  templateUrl: 'collaborators.component.html',
  styleUrls: ['./collaborators.component.scss']
})
export class CollaboratorsComponent implements OnInit, OnDestroy {
  private context: Context;
  private collaborators: User[];
  private emptyStateConfig: EmptyStateConfig;
  private listViewConfig: ListViewConfig;
  private contextSubscription: Subscription;
  private collaboratorSubscription: Subscription;
  @ViewChild('addCollaborators') addCollaboratorsModal: IModalHost;

  constructor(
    private contexts: ContextService,
    private collaboratorService: CollaboratorService) {
    this.contextSubscription = this.contexts.current.subscribe(val => {
      this.context = val;
    });
  }

  ngOnInit() {
    this.listViewConfig = {
      dblClick: false,
      dragEnabled: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      showSelectBox: false,
      useExpandingRows: false
    } as ListViewConfig;

    this.collaboratorSubscription = this.collaboratorService.getAllBySpaceId(this.context.space.id).subscribe(collaborators => {
      this.collaborators = collaborators;
    });
  }

  ngOnDestroy() {
    this.contextSubscription.unsubscribe();
    this.collaboratorSubscription.unsubscribe();
  }

  launchAddCollaborators() {
    this.addCollaboratorsModal.open();
  }

  removeUser(user: User) {
    this.collaboratorService.removeCollaborator(this.context.space.id, user.id).subscribe(() => {
      this.collaborators.splice(this.collaborators.indexOf(user), 1);
    });
  }

  addCollaboratorsToParent(addedUsers: User[]) {
    addedUsers.forEach(user => {
      let matchingUser = _.find(this.collaborators, (existing) => {
        return existing.id === user.id;
      });
      if(!matchingUser) {
        this.collaborators.push(user);
      }
    });
  }
}
