import {
  Component,
  ErrorHandler,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { cloneDeep, findIndex, has } from 'lodash';
import { Broadcaster, Logger } from 'ngx-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Context, Contexts, Space, SpaceService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { Action, ActionConfig } from 'patternfly-ng/action';
import { EmptyStateConfig } from 'patternfly-ng/empty-state';
import { Filter, FilterEvent } from 'patternfly-ng/filter';
import { ListConfig } from 'patternfly-ng/list';
import { SortEvent, SortField } from 'patternfly-ng/sort';
import {
  Observable,
  Subscription
} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ExtProfile, GettingStartedService } from '../../getting-started/services/getting-started.service';
import { UserSpacesService } from '../../shared/user-spaces.service';
import { MySpacesSearchSpacesDialog } from './my-spaces-search-dialog/my-spaces-search-spaces-dialog.component';
import { SpacesType } from './my-spaces-toolbar/my-spaces-toolbar.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-my-spaces',
  templateUrl: 'my-spaces.component.html',
  styleUrls: ['./my-spaces.component.less']
})
export class MySpacesComponent implements OnDestroy, OnInit {

  listConfig: ListConfig;
  resultsCount: number = 0;

  @ViewChild(MySpacesSearchSpacesDialog) private searchSpacesDialog: MySpacesSearchSpacesDialog;

  private readonly pageName = 'myspaces';
  private _spaces: Space[] = [];         // current selection of mySpaces | sharedSpaces
  private displayedSpaces: Space[] = []; // spaces visible in the UI after filters & sorting
  private mySpaces: Space[] = [];        // spaces owned by the user
  private sharedSpaces: Space[] = [];    // spaces where the user is a collaborator
  private appliedFilters: Filter[];
  private spacesCount: Observable<number>;
  private context: Context;
  private currentSortField: SortField;
  private mySpacesEmptyStateConfig: EmptyStateConfig;
  private sharedSpacesEmptyStateConfig: EmptyStateConfig;
  private isAscendingSort: boolean = true;
  private loggedInUser: User;
  private modalRef: BsModalRef;
  private spaceToDelete: Space;
  private subscriptions: Subscription[] = [];

  constructor(
    private contexts: Contexts,
    private gettingStartedService: GettingStartedService,
    private logger: Logger,
    private broadcaster: Broadcaster,
    private modalService: BsModalService,
    private spaceService: SpaceService,
    private userService: UserService,
    private errorHandler: ErrorHandler,
    private userSpacesService: UserSpacesService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.contexts.current.subscribe((val: Context): void => {
        this.context = val;
      })
    );

    this.subscriptions.push(
      this.userService.loggedInUser.subscribe((user: User): void => {
        this.loggedInUser = user;
      })
    );

    this.initPfListConfigs();
    this.initSpaces();
  }

  initPfListConfigs(): void {
    this.currentSortField = {
      id: 'name',
      sortType: 'alpha',
      title: 'Name'
    };

    this.mySpacesEmptyStateConfig = {
      actions: {
        primaryActions: [{
          id: 'createSpace',
          title: 'Create Space',
          tooltip: 'Create Space'
        }],
        moreActions: []
      } as ActionConfig,
      iconStyleClass: 'pficon-add-circle-o',
      title: 'Create a Space',
      info: 'Start by creating a space.'
    } as EmptyStateConfig;

    this.sharedSpacesEmptyStateConfig = {
      title: 'No Spaces Found',
      info: 'You are not listed as a collaborator of any spaces.',
      helpLink: {
        text: 'Find a Space to determine the owner of a space, then contact the space owner to request being added as a collaborator'
      }
    } as EmptyStateConfig;

    this.listConfig = {
      dblClick: false,
      emptyStateConfig: this.mySpacesEmptyStateConfig,
      headingRow: true,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      usePinItems: true
    } as ListConfig;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  initSpaces(): void {
    this.spacesCount = this.userSpacesService.getInvolvedSpacesCount();

    if (this.context && this.context.user) {
      this.subscriptions.push(
        this.spacesCount
          .pipe(
            switchMap((pageSize: number) => this.spaceService.getSpacesByUser(this.context.user.attributes.username, pageSize))
          )
          .subscribe((mySpaces: Space[]): void => {
            this._spaces = this.mySpaces = mySpaces;
            this.updateSpaces();
          })
      );
      this.subscriptions.push(
        this.spacesCount
          .pipe(
            switchMap((pageSize: number) => this.userSpacesService.getSharedSpaces(this.context.user.attributes.username, pageSize))
          )
          .subscribe((sharedSpaces: Space[]): void => {
            this.sharedSpaces = sharedSpaces;
          })
      );
    } else {
      this.errorHandler.handleError('Failed to retrieve list of spaces owned by user');
    }
  }

  toggleChange(event: SpacesType): void {
    if (event === SpacesType.MYSPACES) {
      this.listConfig.emptyStateConfig = this.mySpacesEmptyStateConfig;
      this._spaces = this.mySpaces;
      this.updateSpaces();
    } else if (event === SpacesType.SHAREDSPACES) {
      this.listConfig.emptyStateConfig = this.sharedSpacesEmptyStateConfig;
      this._spaces = this.sharedSpaces;
      this.updateSpaces();
    }
  }

  // Accessors

  get spaces(): Space[] {
    return this.displayedSpaces;
  }

  // Events

  handlePinChange($event: any): void {
    let index: any = findIndex(this.displayedSpaces, (obj: Space): boolean => {
      return obj.id === $event.id;
    });
    if (index > -1) {
      let space: any = this.displayedSpaces[index];
      space.showPin = (space.showPin === undefined) ? true : !space.showPin;
      this.savePins();
      this.updateSpaces();
    }
  }

  // Filter

  applyFilters(): void {
    let filters = this.appliedFilters;
    this.displayedSpaces = [];
    if (filters && filters.length > 0) {
      this._spaces.forEach((space: Space): void => {
        if (this.matchesFilters(space, filters)) {
          this.displayedSpaces.push(space);
        }
      });
    } else {
      this.displayedSpaces = cloneDeep(this._spaces);
    }
    this.resultsCount = this.displayedSpaces.length;
  }

  matchesFilter(space: Space, filter: Filter): boolean {
    let match = true;
    if (filter.field.id === 'name') {
      let re = new RegExp(filter.value, 'i');
      match = space.attributes.name.match(re) !== null;
    }
    return match;
  }

  matchesFilters(space: Space, filters: Filter[]): boolean {
    let matches = true;

    filters.forEach((filter: Filter) => {
      if (!this.matchesFilter(space, filter)) {
        matches = false;
        return false;
      }
    });
    return matches;
  }

  filterChange($event: FilterEvent): void {
    this.appliedFilters = $event.appliedFilters;
    this.updateSpaces();
  }

  // Spaces

  canDeleteSpace(creatorId: string): boolean {
    return creatorId === this.context.user.id;
  }

  confirmDeleteSpace(space: Space, deleteSpace: TemplateRef<any>): void {
    this.spaceToDelete = space;
    this.modalRef = this.modalService.show(deleteSpace, {class: 'modal-lg'});
  }

  removeSpace(): void {
    if (this.context && this.context.user && this.spaceToDelete) {
      let space = this.spaceToDelete;
      this.spaceService.deleteSpace(space)
        .subscribe((): void => {
          let index: any = findIndex(this._spaces, (obj: Space): boolean => {
            return obj.id === space.id;
          });
          if (has(this._spaces[index], 'showPin')) {
            this.savePins();
          }
          this._spaces.splice(index, 1);
          this.broadcaster.broadcast('spaceDeleted', space);
          this.updateSpaces();
          this.spaceToDelete = undefined;
          this.modalRef.hide();
        },
        (err: any): void => {
          this.logger.error(err);
          this.spaceToDelete = undefined;
          this.modalRef.hide();
        });
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  updateSpaces(): void {
    this.restorePins();
    this.applyFilters();
    this.sort();
  }

  // Sort

  compare(space1: Space, space2: Space): number {
    let compValue: number = 0;
    if (this.currentSortField && this.currentSortField.id === 'name') {
      compValue = space1.attributes.name.localeCompare(space2.attributes.name);
    }
    if (!this.isAscendingSort && compValue) {
      compValue = compValue * -1;
    }
    return compValue;
  }

  sort(): void {
    this.displayedSpaces.sort((space1: Space, space2: Space) => this.compare(space1, space2));
  }

  sortChange($event: SortEvent): void {
    this.currentSortField = $event.field;
    this.isAscendingSort = $event.isAscending;
    this.updateSpaces();
  }

  // Wizard

  closeModal($event: any): void {
    this.modalRef.hide();
  }

  showAddSpaceOverlay(): void {
    this.broadcaster.broadcast('showAddSpaceOverlay', true);
  }

  showSearchSpacesOverlay(): void {
    this.searchSpacesDialog.show();
  }

  // Pinned items

  restorePins(): void {
    if (this.loggedInUser.attributes === undefined) {
      return;
    }
    let contextInformation: any = this.loggedInUser.attributes['contextInformation'];
    let pins: any[] = (contextInformation !== undefined && contextInformation.pins !== undefined)
      ? contextInformation.pins[this.pageName] : undefined;

    this._spaces.forEach((space: any): void => {
      space.showPin = false; // Must set default boolean to properly sort pins
      if (pins !== undefined && pins.length > 0) {
        pins.forEach((id: string): void => {
          if (space.id === id) {
            space.showPin = true;
          }
        });
      }
    });
  }

  savePins(): void {
    let profile = this.getTransientProfile();
    if (profile.contextInformation === undefined) {
      profile.contextInformation = {};
    }
    if (profile.contextInformation.pins === undefined) {
      profile.contextInformation.pins = {};
    }
    let pins: any[] = [];
    this.displayedSpaces.forEach((space: any): void => {
      if (space.showPin === true) {
        pins.push(space.id);
      }
    });
    profile.contextInformation.pins[this.pageName] = pins;
    this.subscriptions.push(this.gettingStartedService.update(profile)
      .subscribe((user: User): void => {
        // Do nothing
      },
      (error: string): void => {
        this.logger.error('Failed to save pinned items');
      })
    );
  }

  handleAction($event: Action): void {
    if ($event.id === 'createSpace') {
      this.showAddSpaceOverlay();
    }
  }

  /**
   * Get transient profile with updated properties
   *
   * @returns {ExtProfile} The updated transient profile
   */
  private getTransientProfile(): ExtProfile {
    let profile: ExtProfile = this.gettingStartedService.createTransientProfile();
    delete profile.username;
    return profile;
  }
}
