import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { find } from 'lodash';
import { Broadcaster } from 'ngx-base';
import { ModalDirective } from 'ngx-bootstrap';
import { CollaboratorService, Contexts, Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { Observable,  of as observableOf, Subject, Subscription } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { SpaceNamespaceService } from '../../shared/runtime-console/space-namespace.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-edit-space-description-widget',
  templateUrl: './edit-space-description-widget.component.html',
  styleUrls: ['./edit-space-description-widget.component.less']
})
export class EditSpaceDescriptionWidgetComponent implements OnInit, OnDestroy {

  @Input() userOwnsSpace: boolean;
  space: Space;
  spaceOwner: Observable<string>;
  collaborators: User[];

  private subscriptions: Subscription[] = [];
  private _descriptionUpdater: Subject<string> = new Subject();

  private loggedInUser: User;
  @ViewChild('description') description: any;
  @ViewChild('modalAdd') modalAdd: ModalDirective;

  private isEditing: boolean = false;

  constructor(
    private spaces: Spaces,
    private contexts: Contexts,
    private userService: UserService,
    private broadcaster: Broadcaster,
    private spaceService: SpaceService,
    private spaceNamespaceService: SpaceNamespaceService,
    private collaboratorService: CollaboratorService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.userService.loggedInUser.subscribe((val: User) => this.loggedInUser = val));
    this.subscriptions.push(this.spaces.current
      .subscribe(space => {
        this.space = space;
        if (space) {
          this.subscriptions.push(
            this.collaboratorService.getInitialBySpaceId(space.id).subscribe((users: User[]) => {
              this.collaborators = users;
            })
          );
          this.spaceOwner = this.userService
            .getUserByUserId(space.relationships['owned-by'].data.id)
            .pipe(
              map((u: User) => u.attributes.username)
            );
        }
      }));
    this.subscriptions.push(this._descriptionUpdater.pipe(
      debounceTime(1000),
      map(description => {
        let patch = {
          attributes: {
            description: description,
            name: this.space ? this.space.attributes.name : '',
            version: this.space ? this.space.attributes.version : ''
          },
          type: 'spaces',
          id: this.space ? this.space.id : ''
        } as Space;
        return patch;
      }),
      switchMap(patch => this.spaceService
        .update(patch).pipe(
        tap(val => {
          this.isEditing = false;
          if (this.space && val) {
            this.space.attributes.description = val.attributes.description;
          }
        }),
        tap(updated => this.broadcaster.broadcast('spaceUpdated', updated)),
        switchMap(updated => this.spaceNamespaceService.updateConfigMap(observableOf(updated))))
      ))
      .subscribe()
    );
  }

  onUpdateDescription(description): void {
    this._descriptionUpdater.next(description);
  }

  preventDef(event: any): void {
    event.preventDefault();
  }

  saveDescription(): void {
    this._descriptionUpdater.next(this.description.nativeElement.value);
  }

  stopEditingDescription(): void {
    this.isEditing = false;
  }

  startEditingDescription(): void {
    this.isEditing = true;
  }

  isEditable(): Observable<boolean> {
    return this.contexts.current.pipe(map(val => val.user.id === this.loggedInUser.id));
  }

  launchAddCollaborators(): void {
    this.modalAdd.show();
  }

  addCollaboratorsToParent(addedUsers: User[]): void {
    addedUsers.forEach((user: User) => {
      let matchingUser = find(this.collaborators, (existing: User) => {
        return existing.id === user.id;
      });
      if (!matchingUser) {
        this.collaborators.push(user);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

}
