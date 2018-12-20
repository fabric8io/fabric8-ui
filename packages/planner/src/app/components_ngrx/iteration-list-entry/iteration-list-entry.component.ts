import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from 'ngx-login-client';

import { AND, EQUAL } from '../../services/query-keys';
import { GroupTypeUI } from './../../models/group-types.model';
import { IterationUI } from './../../models/iteration.model';
import { FilterService } from './../../services/filter.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'iteration-list-entry',
  templateUrl: './iteration-list-entry.component.html',
  styleUrls: ['./iteration-list-entry.component.less'],
})
export class IterationListEntryComponent implements OnInit {
  //@Input() listItem: TreeListItemComponent;
  @Input() iteration: IterationUI;
  @Input() selected: boolean = false;
  @Input() collection = [];
  @Input() witGroup: GroupTypeUI;
  @Input() showTree: string = '';
  @Input() showCompleted: string = '';
  @Input() context: 'list' | 'board'; // 'list' or 'board'

  @Output() readonly onEditIteration = new EventEmitter<IterationUI>();
  @Output() readonly onCloseIteration = new EventEmitter<IterationUI>();
  @Output() readonly onCreateIteration = new EventEmitter<IterationUI>();

  loggedIn: Boolean = false;
  queryParams: Object = {};
  selectedItemId: string | number = 0;

  constructor(private auth: AuthenticationService, private filterService: FilterService) {}

  ngOnInit(): void {
    this.loggedIn = this.auth.isLoggedIn();
  }

  constructURL(iterationId: string) {
    //Query for work item type group
    const type_query = this.filterService.queryBuilder('typegroup.name', EQUAL, this.witGroup.name);
    //Query for iteration
    const iteration_query = this.filterService.queryBuilder('iteration', EQUAL, iterationId);
    //Join type and space query
    const first_join = this.filterService.queryJoiner({}, AND, type_query);
    const second_join = this.filterService.queryJoiner(first_join, AND, iteration_query);
    //this.setGroupType(witGroup);
    //second_join gives json object
    return this.filterService.jsonToQuery(second_join);
  }

  constructURLforBoard(iterationId: string) {
    //Query for work item type group
    const type_query = this.filterService.queryBuilder('boardContextId', EQUAL, this.witGroup.id);
    //Query for iteration
    const iteration_query = this.filterService.queryBuilder('iteration', EQUAL, iterationId);
    // join type and iteration query
    const first_join = this.filterService.queryJoiner({}, AND, type_query);
    const second_join = this.filterService.queryJoiner(first_join, AND, iteration_query);
    return this.filterService.jsonToQuery(second_join);
  }

  addRemoveQueryParams(iterationId: string) {
    if (this.context === 'board') {
      return {
        q: this.constructURLforBoard(iterationId),
      };
    }
    if (this.showCompleted && this.showTree) {
      return {
        q: this.constructURL(iterationId),
        showTree: this.showTree,
        showCompleted: this.showCompleted,
      };
    } else if (this.showTree) {
      return {
        q: this.constructURL(iterationId),
        showTree: this.showTree,
      };
    } else if (this.showCompleted) {
      return {
        q: this.constructURL(iterationId),
        showCompleted: this.showCompleted,
      };
    } else {
      return {
        q: this.constructURL(iterationId),
      };
    }
  }

  toggleChildrenDisplay(iteration) {
    // TODO: Dispatch an action to this
    iteration.showChildren = !iteration.showChildren;
  }

  editIteration(iteration) {
    this.onEditIteration.emit(iteration);
  }

  closeIteration(iteration) {
    this.onCloseIteration.emit(iteration);
  }

  createIteration(iteration) {
    this.onCreateIteration.emit(iteration);
  }
  calcDepth(iteration: IterationUI): string {
    let depth = iteration.parentPath.split('/').length - 1;
    return 'depth-' + depth;
  }
}
