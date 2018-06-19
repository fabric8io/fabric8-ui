import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { CollaboratorService, Contexts, Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { Observable, Subject } from 'rxjs';
import { SpaceNamespaceService } from '../../shared/runtime-console/space-namespace.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-edit-space-description-widget',
  templateUrl: './edit-space-description-widget.component.html',
  styleUrls: ['./edit-space-description-widget.component.less']
})
export class EditSpaceDescriptionWidgetComponent implements OnInit {

  @Input() userOwnsSpace: boolean;
  space: Space;
  spaceOwner: Observable<string>;
  collaboratorCount: Observable<number>;

  private _descriptionUpdater: Subject<string> = new Subject();

  private loggedInUser: User;
  @ViewChild('description') description: any;

  private isEditing: boolean = false;

  constructor(
    private spaces: Spaces,
    private contexts: Contexts,
    private userService: UserService,
    private broadcaster: Broadcaster,
    private spaceService: SpaceService,
    private spaceNamespaceService: SpaceNamespaceService,
    private collaboratorService: CollaboratorService
  ) {
    spaces.current
      .subscribe(space => {
        this.space = space;
        if (space) {
          this.collaboratorCount = this.collaboratorService.getInitialBySpaceId(space.id).map(c => c.length);
          this.spaceOwner = this.userService.getUserByUserId(space.relationships['owned-by'].data.id).map(u => u.attributes.username);
        } else {
          this.collaboratorCount = Observable.empty();
          this.spaceOwner = Observable.empty();
        }
      });
    userService.loggedInUser.subscribe(val => this.loggedInUser = val);
  }

  ngOnInit() {
    this._descriptionUpdater
      .debounceTime(1000)
      .map(description => {
        let patch = {
          attributes: {
            description: description,
            name: this.space ? this.space.attributes.name : '',
            version: this.space ? this.space.attributes.version : ''
          },
          type: 'spaces',
          id: this.space.id
        } as Space;
        return patch;
      })
      .do(val => console.log(val))
      .switchMap(patch => this.spaceService
        .update(patch)
        .do(val => {
          this.isEditing = false;
          if (this.space && val) {
            this.space.attributes.description = val.attributes.description;
          }
        })
        .do(updated => this.broadcaster.broadcast('spaceUpdated', updated))
        .switchMap(updated => this.spaceNamespaceService.updateConfigMap(Observable.of(updated)))
      )
      .subscribe();
  }

  onUpdateDescription(description) {
    this._descriptionUpdater.next(description);
  }

  preventDef(event: any) {
    event.preventDefault();
  }

  saveDescription() {
    this._descriptionUpdater.next(this.description.nativeElement.value);
  }

  stopEditingDescription() {
    this.isEditing = false;
  }

  startEditingDescription() {
    this.isEditing = true;
  }

  isEditable(): Observable<boolean> {
    return this.contexts.current.map(val => val.user.id === this.loggedInUser.id);
  }

}
