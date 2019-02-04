import { Component, Input, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { ModalDirective } from 'ngx-bootstrap';
import { uniqBy } from 'lodash';
import { CollaboratorService, Space, AreaService, SpaceService, Spaces } from 'ngx-fabric8-wit';
import { of as observableOf, BehaviorSubject, Subscription, Observable, empty } from 'rxjs';
import { switchMap, tap, first, catchError, concatMap } from 'rxjs/operators';
import { User } from 'ngx-login-client';
import { SpaceNamespaceService } from '../../shared/runtime-console/space-namespace.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-space-settings-widget',
  templateUrl: './space-settings-widget.component.html',
  styleUrls: ['./space-settings-widget.component.less'],
})
export class SpaceSettingsWidgetComponent implements OnInit {
  @Input() userOwnsSpace: boolean;
  @Input() userIsSpaceAdmin: boolean;
  @Input() user: User;
  @Input() space: Space;
  @ViewChild('spaceDescription') description: ElementRef;
  @ViewChild('modalAdd') modalAdd: ModalDirective;

  private subscriptions: Subscription[] = [];
  private _currentUser: User;
  private _currentSpace: Space;
  private areaCount: number;
  private isEditing: boolean = false;
  private _descriptionUpdater: BehaviorSubject<string>;
  collaborators: User[] = [];
  filteredCollaborators: User[] = [];
  collaboratorCount: number = 0;

  constructor(
    private areaService: AreaService,
    private broadcaster: Broadcaster,
    private collaboratorService: CollaboratorService,
    private spaces: Spaces,
    private spaceService: SpaceService,
    private spaceNamespaceService: SpaceNamespaceService,
  ) {}

  ngOnInit(): void {
    this._currentUser = this.user;
    this.space = this.space;
    this._descriptionUpdater = new BehaviorSubject(this.space.attributes.description);

    this.spaces.current.subscribe((space) => {
      this.space = space;
      this._currentSpace = this.space;
    });
    this.areaService.getAllBySpaceId(this._currentSpace.id).subscribe((areas) => {
      this.areaCount = areas.length;
    });
    this.refreshCollaboratorCount();
    this.subscriptions.push(
      this._descriptionUpdater.debounceTime(1000).subscribe((description) => {
        this.updateDescription(description);
      }),
    );
  }

  get UserEmail(): string {
    return this._currentUser.attributes.email;
  }

  get UserName(): string {
    return this._currentUser.attributes.username;
  }

  get SpaceDescription(): string {
    return this._currentSpace.attributes.description;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  updateDescription(description: string): void {
    let patch = {
      attributes: {
        description: description,
        name: this.space ? this.space.attributes.name : '',
        version: this.space ? this.space.attributes.version : '',
      },
      type: 'spaces',
      id: this.space ? this.space.id : '',
    } as Space;
    this.spaceService
      .update(patch)
      .pipe(
        tap((val) => {
          this.isEditing = false;
          if (this.space && val) {
            this.space.attributes.description = val.attributes.description;
          }
        }),
        tap((updated) => this.broadcaster.broadcast('spaceUpdated', updated)),
        switchMap((updated) => this.spaceNamespaceService.updateConfigMap(observableOf(updated))),
      )
      .subscribe();
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

  isEditable(): boolean {
    return this.userIsSpaceAdmin;
  }

  addCollaboratorsToParent(addedUsers: User[]): void {
    this.collaborators = uniqBy(this.collaborators.concat(addedUsers), 'id');
    this.filteredCollaborators = this.collaborators;
  }

  onCollaboratorSearchChange(searchTerm: string): void {
    if (searchTerm === '') {
      this.filteredCollaborators = this.collaborators;
      return;
    }
    this.filteredCollaborators = this.collaborators.filter(
      (user: User): boolean =>
        user.attributes.fullName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
        user.attributes.username.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
    );
  }

  popoverInit(pageSize: number): void {
    this.fetchCollaboratorsFrom(
      this.collaboratorService.getInitialBySpaceId(this.space.id, pageSize),
    );
  }

  launchAddCollaborators(): void {
    this.modalAdd.show();
  }

  fetchMoreCollaborators(): void {
    this.fetchCollaboratorsFrom(this.collaboratorService.getNextCollaborators());
  }

  private fetchCollaboratorsFrom(obs: Observable<User[]>): void {
    obs
      .pipe(
        first(),
        catchError((): Observable<User[]> => empty()),
      )
      .subscribe((users: User[]): void => this.addCollaboratorsToParent(users));
  }

  refreshCollaboratorCount(): void {
    this.subscriptions.push(
      this.collaboratorService
        .getInitialBySpaceId(this.space.id)
        .pipe(concatMap(() => this.collaboratorService.getTotalCount()))
        .subscribe(
          (count: number): void => {
            this.collaboratorCount = count;
          },
        ),
    );
  }
}
