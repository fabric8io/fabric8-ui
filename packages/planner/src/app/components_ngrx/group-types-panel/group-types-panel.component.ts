import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Spaces } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

import { GroupTypeQuery, GroupTypeUI } from '../../models/group-types.model';
import { FilterService } from '../../services/filter.service';
import { AND, EQUAL } from '../../services/query-keys';

// ngrx stuff
import { select, Store } from '@ngrx/store';
import { SpaceQuery } from '../../models/space';
import * as GroupTypeActions from './../../actions/group-type.actions';
import { AppState } from './../../states/app.state';

@Component({
  selector: 'group-types',
  templateUrl: './group-types-panel.component.html',
  styleUrls: ['./group-types-panel.component.less'],
})
export class GroupTypesComponent implements OnInit, OnDestroy {
  @Input() sidePanelOpen: boolean = true;
  @Input() context: 'list' | 'board'; // 'list' or 'board'

  authUser: any = null;
  infotipSource = this.store.pipe(
    select('planner'),
    select('infotips'),
  );
  private groupTypes: GroupTypeUI[];
  private eventListeners: any[] = [];
  private startedCheckingURL: boolean = false;
  private showTree: string = '';
  private showCompleted: string = '';

  constructor(
    private auth: AuthenticationService,
    private filterService: FilterService,
    private groupTypeQuery: GroupTypeQuery,
    private spaceQuery: SpaceQuery,
    private route: ActivatedRoute,
    private router: Router,
    private spaces: Spaces,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    const groupTypesData = this.groupTypeQuery.getGroupTypes;
    const spaceData = this.spaceQuery.getCurrentSpace.pipe(filter((space) => space !== null));

    this.eventListeners.push(
      combineLatest(groupTypesData, spaceData).subscribe(([types, space]) => {
        this.groupTypes = types as GroupTypeUI[];
        if (!this.startedCheckingURL) {
          this.checkURL();
        }
      }),
    );
  }

  ngOnDestroy() {
    this.eventListeners.forEach((e) => e.unsubscribe());
  }

  fnBuildQueryParam(witGroup) {
    //Query for work item type group
    const type_query = this.filterService.queryBuilder('typegroup.name', EQUAL, witGroup.name);
    const first_join = this.filterService.queryJoiner({}, AND, type_query);
    //second_join gives json object
    return this.filterService.jsonToQuery(first_join);
    //reverse function jsonToQuery(second_join);
  }

  fnBuildQueryParamForBoard(witGroup) {
    const type_query = this.filterService.queryBuilder('boardContextId', EQUAL, witGroup.id);
    // join query with typeQuery
    const second_join = this.filterService.queryJoiner({}, AND, type_query);
    return this.filterService.jsonToQuery(second_join);
  }

  addRemoveQueryParams(witGroup) {
    // If it's a board view then quoery should only have the board id
    if (this.context === 'board') {
      return { q: this.fnBuildQueryParamForBoard(witGroup) };
    }

    // For list view it works differently
    if (this.showCompleted && this.showTree) {
      return {
        q: this.fnBuildQueryParam(witGroup),
        showTree: this.showTree,
        showCompleted: this.showCompleted,
      };
    } else if (this.showTree) {
      return {
        q: this.fnBuildQueryParam(witGroup),
        showTree: this.showTree,
      };
    } else if (this.showCompleted) {
      return {
        q: this.fnBuildQueryParam(witGroup),
        showCompleted: this.showCompleted,
      };
    } else {
      return {
        q: this.fnBuildQueryParam(witGroup),
      };
    }
  }

  checkURL() {
    this.startedCheckingURL = true;
    this.eventListeners.push(
      this.route.queryParams.subscribe((val) => {
        if (val.hasOwnProperty('q')) {
          let selectedTypeGroup: GroupTypeUI;
          if (val['q'].includes('boardContextId')) {
            //filter service getConditionFromQuery returns undefined for non AND operations
            let selectedTypeGroupId = this.filterService.getConditionFromQuery(
              val.q,
              'boardContextId',
            );
            if (selectedTypeGroupId === undefined) {
              selectedTypeGroupId = this.filterService.queryToFlat(val.q)[0].value;
            }
            if (selectedTypeGroupId) {
              selectedTypeGroup = this.groupTypes.find((g) => g.id === selectedTypeGroupId);
            }
          } else {
            const selectedTypeGroupName = this.filterService.getConditionFromQuery(
              val.q,
              'typegroup.name',
            );
            if (selectedTypeGroupName) {
              selectedTypeGroup = this.groupTypes.find((g) => g.name === selectedTypeGroupName);
            }
          }
          if (selectedTypeGroup && !selectedTypeGroup.selected) {
            this.store.dispatch(new GroupTypeActions.SelectType(selectedTypeGroup));
          }
        }
        if (val.hasOwnProperty('showTree')) {
          this.showTree = val.showTree;
        } else {
          this.showTree = '';
        }
        if (val.hasOwnProperty('showCompleted')) {
          this.showCompleted = val.showCompleted;
        } else {
          this.showCompleted = '';
        }
      }),
    );
  }

  getInfotipText(id: string) {
    return this.infotipSource.pipe(
      select((s) => s[id]),
      select((i) => (i ? i['en'] : id)),
    );
  }

  //This function navigates to the desired work item group type page
  groupTypeClickHandler(e: MouseEvent, item: GroupTypeUI) {
    if (!e.srcElement.classList.contains('infotip-icon')) {
      let q = this.addRemoveQueryParams(item);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: q,
      });
    }
  }
}
