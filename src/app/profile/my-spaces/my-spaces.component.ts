import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { cloneDeep, findIndex, has } from 'lodash';
import { Logger } from 'ngx-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Context, Contexts, Space, SpaceService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import {
  Action,
  ActionConfig,
  EmptyStateConfig,
  Filter,
  FilterEvent,
  ListConfig,
  SortEvent,
  SortField
} from 'patternfly-ng';
import { Subscription } from 'rxjs';

import { ExtProfile, GettingStartedService } from '../../getting-started/services/getting-started.service';
import { EventService } from '../../shared/event.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-my-spaces',
  templateUrl: 'my-spaces.component.html',
  styleUrls: ['./my-spaces.component.less']
})
export class MySpacesComponent implements OnDestroy, OnInit {
  @ViewChild('createSpace') createSpaceTemplate: TemplateRef<any>;

  listConfig: ListConfig;
  showSpaces: boolean = false;

  private _spaces: Space[] = [];
  private appliedFilters: Filter[];
  private allSpaces: Space[] = [];
  private context: Context;
  private currentSortField: SortField;
  private emptyStateConfig: EmptyStateConfig;
  private isAscendingSort: boolean = true;
  private loggedInUser: User;
  private modalRef: BsModalRef;
  private pageName = 'myspaces';
  private pageSize: number = 2000;
  private resultsCount: number = 0;
  private selectedFlow: string = 'start';
  private space: string = '';
  private spaceToDelete: Space;
  private subscriptions: Subscription[] = [];

  constructor(
    private contexts: Contexts,
    private eventService: EventService,
    private gettingStartedService: GettingStartedService,
    private logger: Logger,
    private modalService: BsModalService,
    private spaceService: SpaceService,
    private userService: UserService
  ) {
    this.subscriptions.push(this.contexts.current.subscribe(val => this.context = val));
    this.subscriptions.push(userService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    this.currentSortField = {
      id: 'name',
      sortType: 'alpha',
      title: 'Name'
    };

    this.emptyStateConfig = {
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

    this.listConfig = {
      dblClick: false,
      emptyStateConfig: this.emptyStateConfig,
      headingRow: true,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      usePinItems: true
    } as ListConfig;

    this.initSpaces({pageSize: this.pageSize});
  }

  // Accessors

  get spaces(): Space[] {
    return this._spaces;
  }

  // Events

  handleAction($event: Action): void {
    if ($event.id === 'createSpace') {
      this.openForgeWizard(this.createSpaceTemplate);
    }
  }

  handlePinChange($event: any): void {
    let index: any = findIndex(this.allSpaces, (obj) => {
      return obj.id === $event.id;
    });
    if (index > -1) {
      let space: any = this.allSpaces[index];
      space.showPin = (space.showPin === undefined) ? true : !space.showPin;
      this.savePins();
      this.updateSpaces();
    }
  }

  // Filter

  applyFilters(filters: Filter[]): void {
    this.appliedFilters = filters;
    this._spaces = [];
    if (filters && filters.length > 0) {
      this.allSpaces.forEach((space) => {
        if (this.matchesFilters(space, filters)) {
          this._spaces.push(space);
        }
      });
    } else {
      this._spaces = cloneDeep(this.allSpaces);
    }
    this.resultsCount = this._spaces.length;
  }

  filterChange($event: FilterEvent): void {
    this.applyFilters($event.appliedFilters);
    this.sort();
  }

  matchesFilter(space: Space, filter: Filter): boolean {
    let match = true;
    if (filter.field.id === 'name') {
      match = space.attributes.name.match(filter.value) !== null;
    }
    return match;
  }

  matchesFilters(space: Space, filters: Filter[]): boolean {
    let matches = true;

    filters.forEach((filter) => {
      if (!this.matchesFilter(space, filter)) {
        matches = false;
        return false;
      }
    });
    return matches;
  }

  // Spaces

  canDeleteSpace(creatorId: string): boolean {
    return creatorId === this.context.user.id;
  }

  confirmDeleteSpace(space: Space, deleteSpace: TemplateRef<any>): void {
    this.spaceToDelete = space;
    this.modalRef = this.modalService.show(deleteSpace, {class: 'modal-lg'});
  }

  initSpaces(event: any): void {
    this.pageSize = event.pageSize;
    if (this.context && this.context.user) {
      this.spaceService
        .getSpacesByUser(this.context.user.attributes.username, this.pageSize)
        .subscribe(spaces => {
          this.showSpaces = true;
          this.allSpaces = spaces;
          this.restorePins();
          this.updateSpaces();
        });
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  removeSpace(): void {
    if (this.context && this.context.user && this.spaceToDelete) {
      let space = this.spaceToDelete;
      this.spaceService.deleteSpace(space)
        .do(() => {
          this.eventService.deleteSpaceSubject.next(space);
        })
        .subscribe(spaces => {
          let index: any = findIndex(this.allSpaces, (obj) => {
            return obj.id === space.id;
          });
          if (has(this.allSpaces[index], 'showPin')) {
            this.savePins();
          }
          this.allSpaces.splice(index, 1);
          this.updateSpaces();
          this.spaceToDelete = undefined;
          this.modalRef.hide();
        },
        err => {
          this.logger.error(err);
          this.spaceToDelete = undefined;
          this.modalRef.hide();
        });
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  updateSpaces(): void {
    this.applyFilters(this.appliedFilters);
    this.sort();
  }

  // Sort

  compare(space1: Space, space2: Space): number {
    var compValue = 0;
    if (this.currentSortField && this.currentSortField.id === 'name') {
      compValue = space1.attributes.name.localeCompare(space2.attributes.name);
    }
    if (!this.isAscendingSort) {
      compValue = compValue * -1;
    }
    return compValue;
  }

  sort(): void {
    this._spaces.sort((space1: Space, space2: Space) => this.compare(space1, space2));
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

  openForgeWizard(addSpace: TemplateRef<any>) {
    this.selectedFlow = 'start';
    this.modalRef = this.modalService.show(addSpace, {class: 'modal-lg'});
  }

  selectFlow($event) {
    this.selectedFlow = $event.flow;
    this.space = $event.space;
  }

  // Pinned items

  restorePins() {
    if (this.loggedInUser.attributes === undefined) {
      return;
    }
    let contextInformation = this.loggedInUser.attributes['contextInformation'];
    let pins = (contextInformation !== undefined && contextInformation.pins !== undefined)
      ? contextInformation.pins[this.pageName] : undefined;

    this.allSpaces.forEach((space: any) => {
      space.showPin = false; // Must set default boolean to properly sort pins
      if (pins !== undefined && pins.length > 0) {
        pins.forEach((id) => {
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
    let pins = [];
    this.allSpaces.forEach((space: any) => {
      if (space.showPin === true) {
        pins.push(space.id);
      }
    });
    profile.contextInformation.pins[this.pageName] = pins;

    this.subscriptions.push(this.gettingStartedService.update(profile).subscribe(user => {
      // Do nothing
    }, error => {
      this.logger.error('Failed to save pinned items');
    }));
  }

  /**
   * Get transient profile with updated properties
   *
   * @returns {ExtProfile} The updated transient profile
   */
  private getTransientProfile(): ExtProfile {
    let profile = this.gettingStartedService.createTransientProfile();
    delete profile.username;

    return profile;
  }
}
