import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { IModalHost } from '../../space-wizard/models/modal-host';

import { Context, CollaboratorService } from 'ngx-fabric8-wit';

import { User } from 'ngx-login-client';
import { ListConfig, EmptyStateConfig } from 'patternfly-ng';

import { ContextService } from '../../shared/context.service';
import { find } from 'lodash';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-collaborators',
  templateUrl: 'collaborators.component.html',
  styleUrls: ['./collaborators.component.less']
})
export class CollaboratorsComponent implements OnInit, OnDestroy {
  private context: Context;
  private collaborators: User[];
  private emptyStateConfig: EmptyStateConfig;
  private listConfig: ListConfig;
  private contextSubscription: Subscription;
  private collaboratorSubscription: Subscription;
  private userToRemove: User;
  @ViewChild('addCollaborators') addCollaboratorsModal: IModalHost;
  @ViewChild('removeCollaborator') removeCollaborator: IModalHost;

  constructor(
    private contexts: ContextService,
    private collaboratorService: CollaboratorService) {
    this.contextSubscription = this.contexts.current.subscribe(val => {
      this.context = val;
    });
  }

  ngOnInit() {
    this.listConfig = {
      dblClick: false,
      dragEnabled: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      useExpandItems: false
    } as ListConfig;
    this.collaborators = [];
  }

  initCollaborators(event: any): void {
    let pageSize = event.pageSize;
    console.log('event size from page', pageSize);
    pageSize = 20;
    this.collaboratorSubscription = this.collaboratorService.getInitialBySpaceId(this.context.space.id, pageSize).subscribe(collaborators => {
      this.collaborators = collaborators;
    });
  }

  fetchMoreCollaborators($event): void {
    this.collaboratorService.getNextCollaborators()
      .subscribe(collaborators => {
        if(collaborators)
          this.collaborators = this.collaborators.concat(collaborators);
        }, err => {
        console.log(err);
      });
  }

  ngOnDestroy() {
    this.contextSubscription.unsubscribe();
    this.collaboratorSubscription.unsubscribe();
  }

  launchAddCollaborators() {
    this.addCollaboratorsModal.open();
  }

  confirmUserRemove(user: User): void {
    this.userToRemove = user;
    this.removeCollaborator.open();
  }

  removeUser() {
    this.collaboratorService.removeCollaborator(this.context.space.id, this.userToRemove.id).subscribe(() => {
      this.collaborators.splice(this.collaborators.indexOf(this.userToRemove), 1);
      this.userToRemove = null;
      this.removeCollaborator.close();
    });
  }

  addCollaboratorsToParent(addedUsers: User[]) {
    addedUsers.forEach(user => {
      let matchingUser = find(this.collaborators, (existing) => {
        return existing.id === user.id;
      });
      if(!matchingUser) {
        this.collaborators.push(user);
      }
    });
  }
}
