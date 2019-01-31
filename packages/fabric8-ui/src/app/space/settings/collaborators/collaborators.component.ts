import {
  Component,
  ErrorHandler,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { find } from 'lodash';
import { Logger } from 'ngx-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CollaboratorService, Context } from 'ngx-fabric8-wit';
import { PermissionService, User } from 'ngx-login-client';
import { UserRoleData } from 'ngx-login-client/auth/permission.service';
import { EmptyStateConfig } from 'patternfly-ng/empty-state';
import { ListConfig } from 'patternfly-ng/list';
import { Subscription } from 'rxjs';
import { ContextService } from '../../../shared/context.service';
import { AddCollaboratorsDialogComponent } from './add-collaborators-dialog/add-collaborators-dialog.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-collaborators',
  templateUrl: 'collaborators.component.html',
  styleUrls: ['./collaborators.component.less'],
})
export class CollaboratorsComponent implements OnInit, OnDestroy {
  private emptyStateConfig: EmptyStateConfig;

  private listConfig: ListConfig;

  private subscriptions: Subscription = new Subscription();

  private userToRemove: User;

  @ViewChild('addCollabDialog') addCollabDialog: AddCollaboratorsDialogComponent;

  @ViewChild('modalAdd') modalAdd: ModalDirective;

  @ViewChild('modalDelete') modalDelete: ModalDirective;

  context: Context;

  collaborators: User[];

  adminCollaborators: Array<string> = [];

  constructor(
    private contexts: ContextService,
    private collaboratorService: CollaboratorService,
    private permissionService: PermissionService,
    private errorHandler: ErrorHandler,
    private logger: Logger,
  ) {
    this.subscriptions.add(
      this.contexts.current.subscribe((ctx: Context) => {
        this.context = ctx;
      }),
    );
  }

  ngOnInit() {
    this.listConfig = {
      dblClick: false,
      dragEnabled: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      useExpandItems: false,
    } as ListConfig;
    this.collaborators = [];
    this.subscriptions.add(
      this.permissionService
        .getUsersByRole(this.context.space.id, 'admin')
        .subscribe((users: UserRoleData[]) => {
          this.adminCollaborators = users.map((user) => user.assignee_id);
        }),
    );
  }

  initCollaborators(event: any): void {
    let pageSize = event.pageSize;
    pageSize = 20;
    this.subscriptions.add(
      this.collaboratorService.getInitialBySpaceId(this.context.space.id, pageSize).subscribe(
        (collaborators: User[]): void => {
          this.collaborators = collaborators;
          this.sortCollaborators();
        },
        (err: any): void => {
          this.errorHandler.handleError(err);
          this.logger.error(err);
        },
      ),
    );
  }

  fetchMoreCollaborators($event): void {
    this.subscriptions.add(
      this.collaboratorService.getNextCollaborators().subscribe(
        (collaborators: User[]): void => {
          if (collaborators) {
            this.collaborators = this.collaborators.concat(collaborators);
            this.sortCollaborators();
          }
        },
        (err: any): void => {
          this.errorHandler.handleError(err);
          this.logger.error(err);
        },
      ),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  launchAddCollaborators() {
    this.modalAdd.show();
  }

  confirmUserRemove(user: User): void {
    this.userToRemove = user;
    this.modalDelete.show();
  }

  removeUser() {
    this.subscriptions.add(
      this.collaboratorService
        .removeCollaborator(this.context.space.id, this.userToRemove.id)
        .subscribe(
          () => {
            this.collaborators.splice(this.collaborators.indexOf(this.userToRemove), 1);
            this.adminCollaborators = this.adminCollaborators.filter(
              (val) => this.userToRemove.id !== val,
            );
            this.userToRemove = null;
            this.modalDelete.hide();
          },
          (err: any): void => {
            this.errorHandler.handleError(err);
            this.logger.error(err);
          },
        ),
    );
  }

  assignUserRole(userId: string, roleName: string) {
    // admin, contributor
    this.subscriptions.add(
      this.permissionService.assignRole(this.context.space.id, roleName, [userId]).subscribe(
        () => {
          if (roleName === 'admin') {
            this.adminCollaborators.push(userId);
          } else {
            this.adminCollaborators = this.adminCollaborators.filter((val) => userId !== val);
          }
        },
        (err: any): void => {
          this.errorHandler.handleError(err);
          this.logger.error(err);
        },
      ),
    );
  }

  addCollaboratorsToParent(addedUsers: User[]) {
    addedUsers.forEach((user) => {
      const matchingUser = find(this.collaborators, (existing) => existing.id === user.id);
      if (!matchingUser) {
        this.collaborators.push(user);
      }
    });
    this.sortCollaborators();
  }

  onShowHandler() {
    this.addCollabDialog.onOpen();
  }

  isSpaceOwner(userId: string) {
    return this.context.space.relationships['owned-by'].data.id === userId;
  }

  private sortCollaborators(): void {
    this.collaborators.sort(
      (a: User, b: User): number => a.attributes.username.localeCompare(b.attributes.username),
    );
  }
}
