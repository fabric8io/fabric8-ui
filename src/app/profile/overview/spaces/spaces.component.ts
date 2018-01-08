import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';

import { Broadcaster, Logger } from 'ngx-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { Space, SpaceService } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.less'],
  providers: [SpaceService]
})
export class SpacesComponent implements OnDestroy, OnInit  {
  context: Context;
  loggedInUser: User;
  pageSize: number = 20;
  subscriptions: Subscription[] = [];
  // spaceToDelete: Space;
  spaces: Space[] = [];
  modalRef: BsModalRef;
  private selectedFlow: string;
  private space: string;

  constructor(
      private contexts: Contexts,
      private logger: Logger,
      private spaceService: SpaceService,
      private userService: UserService,
      private modalService: BsModalService,
      private authentication: AuthenticationService,
      private broadcaster: Broadcaster
  ) {
    this.space = '';
    this.selectedFlow = 'start';
    this.subscriptions.push(contexts.current.subscribe(val => this.context = val));
  }

  ngOnInit(): void {
    this.initSpaces({pageSize: this.pageSize});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  // Actions

  initSpaces(event: any): void {
    this.pageSize = event.pageSize;
    if (this.context && this.context.user) {
      this.subscriptions.push(this.spaceService
        .getSpacesByUser(this.context.user.attributes.username, this.pageSize)
        .subscribe(spaces => {
          this.spaces = spaces;
        }));
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  fetchMoreSpaces($event): void {
    if (this.context && this.context.user) {
      this.subscriptions.push(this.spaceService.getMoreSpacesByUser()
        .subscribe(spaces => {
            this.spaces = this.spaces.concat(spaces);
          },
          err => {
            this.logger.error(err);
          }));
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  // removeSpace(): void {
  //   if (this.context && this.context.user && this.spaceToDelete) {
  //     let space = this.spaceToDelete;
  //     this.subscriptions.push(this.spaceService.deleteSpace(space)
  //     .subscribe(spaces => {
  //           let index = this.spaces.indexOf(space);
  //       this.spaces.splice(index, 1);
  //       this.spaceToDelete = undefined;
  //       this.modalRef.hide();
  //     },
  //     err => {
  //     this.logger.error(err);
  //     this.spaceToDelete = undefined;
  //     this.modalRef.hide();
  //     }));
  //   } else {
  //     this.logger.error('Failed to retrieve list of spaces owned by user');
  //   }
  // }

  // confirmDeleteSpace(space: Space, deleteSpace: TemplateRef<any>): void {
  //   this.spaceToDelete = space;
  //   this.modalRef = this.modalService.show(deleteSpace, { class: 'modal-lg' });
  // }

  openForgeWizard(addSpace: TemplateRef<any>) {
    if (this.authentication.getGitHubToken()) {
      this.selectedFlow = 'start';
      this.modalRef = this.modalService.show(addSpace, {class: 'modal-lg'});
    } else {
      this.broadcaster.broadcast('showDisconnectedFromGitHub', {'location': window.location.href });
    }
  }

  closeModal($event: any): void {
    this.modalRef.hide();
  }

  cancel() {
    this.modalRef.hide();
  }

  selectFlow($event) {
    this.selectedFlow = $event.flow;
    this.space = $event.space;
  }

}
