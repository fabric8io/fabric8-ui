import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Area, AreaService, Context } from 'ngx-fabric8-wit';
import { Subscription } from 'rxjs';

import {
  Action,
  ActionConfig,
  EmptyStateConfig,
  Filter,
  FilterEvent,
  SortEvent,
  SortField,
  TreeListConfig
} from 'patternfly-ng';

import { ContextService } from '../../../shared/context.service';
import { CreateAreaDialogComponent } from './create-area-dialog/create-area-dialog.component';

import { cloneDeep } from 'lodash';

// Interface to extend Area of ngx-fabric8-wit
export interface ExtArea extends Area {
  expanded: boolean;
  children: Area[];
}

// Interface for the node object of angular-tree-component
export interface Node {
 data: {
   id: string;
 };
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-areas',
  templateUrl: 'areas.component.html',
  styleUrls: ['./areas.component.less']
})
export class AreasComponent implements OnInit, OnDestroy {

  @ViewChild(CreateAreaDialogComponent) createAreaDialog: CreateAreaDialogComponent;
  @ViewChild(ModalDirective) modal: ModalDirective;

  allAreas: ExtArea[]; // flat array obtained directly from API
  filteredAreas: ExtArea[]; // flat array filtered and sorted
  treeAreas: ExtArea[]; // transformed flat array into tree list

  actionConfig: ActionConfig;
  appliedFilters: Filter[];
  context: Context;
  currentSortField: SortField;
  defaultArea: string;
  emptyStateConfig: EmptyStateConfig;
  isAscendingSort: boolean = true;
  selectedAreaId: string;
  subscriptions: Subscription[] = [];
  resultsCount: number = 0;
  treeListConfig: TreeListConfig;

  constructor(private contexts: ContextService,
              private areaService: AreaService) {
    this.contexts.current.subscribe(val => this.context = val);
  }

  ngOnInit() {
    this.actionConfig = {
      moreActions: [{
        id: 'addChildArea',
        title: 'Add Child Area',
        tooltip: 'Add Child Area'
      }]
    } as ActionConfig;

    this.emptyStateConfig = {
      actions: {
        primaryActions: [{
          id: 'addArea',
          title: 'Add Area',
          tooltip: 'Add Area'
        }],
        moreActions: []
      } as ActionConfig,
      title: 'Add Area',
      info: 'Start by adding an area.'
    } as EmptyStateConfig;

    this.treeListConfig = {
      dblClick: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      treeOptions: {
        allowDrag: false,
        isExpandedField: 'expanded'
      }
    } as TreeListConfig;

    this.subscriptions.push(this.areaService.getAllBySpaceId(this.context.space.id).subscribe(areas => {
      this.selectedAreaId = this.context.space.id;
      areas.forEach((area) => {
        if (area.attributes.parent_path == '/') {
          this.selectedAreaId = area.id;
          this.defaultArea = area.id;
        }
      });
      this.allAreas = areas as ExtArea[]; // store all areas for filter/sort
      this.treeAreas = this.buildTree(this.allAreas); // transform flat array into tree list
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  openModal(): void {
    this.modal.show();
  }

  addChildArea(id: string): void {
    this.selectedAreaId = this.defaultArea;
    if (id) {
      this.selectedAreaId = id;
    }
    this.openModal();
  }

  addArea(area: ExtArea): void {
    this.allAreas.push(area);

    // Reapply sort and filter, if any
    this.allAreas.sort((area1: Area, area2: Area) => this.compare(area1, area2));
    this.applyFilters(this.appliedFilters);
  }

  // Filter

  applyFilters(filters: Filter[]): void {
    this.appliedFilters = filters;
    this.filteredAreas = [];
    if (filters && filters.length > 0) {
      this.allAreas.forEach((area) => {
        if (this.matchesFilters(area, filters)) {
          this.filteredAreas.push(cloneDeep(area));
        }
      });
      this.treeAreas = this.buildFilteredTree(this.filteredAreas);
    } else {
      this.treeAreas = this.buildTree(this.allAreas);
    }
    this.resultsCount = this.filteredAreas.length;
  }

  filterChange($event: FilterEvent): void {
    this.applyFilters($event.appliedFilters);
  }

  matchesFilter(area: Area, filter: Filter): boolean {
    let match = true;

    if (filter.field.id === 'area') {
      match = area.attributes.name.match(filter.value) !== null;
    }
    return match;
  }

  matchesFilters(area: Area, filters: Filter[]): boolean {
    let matches = true;

    filters.forEach((filter) => {
      if (!this.matchesFilter(area, filter)) {
        matches = false;
        return false;
      }
    });
    return matches;
  }

  // Sort

  compare(area1: Area, area2: Area): number {
    var compValue = 0;
    if (this.currentSortField === undefined || this.currentSortField.id === 'area') {
      compValue = area1.attributes.name.localeCompare(area2.attributes.name);
    }
    if (!this.isAscendingSort) {
      compValue = compValue * -1;
    }
    return compValue;
  }

  sortChange($event: SortEvent): void {
    this.currentSortField = $event.field;
    this.isAscendingSort = $event.isAscending;
    this.allAreas.sort((area1: Area, area2: Area) => this.compare(area1, area2));
    this.applyFilters(this.appliedFilters); // Reapply filters, if any
  }

  // Transform flat array into tree list

  private buildTree(elements: ExtArea[], tree = []): ExtArea[] {
    elements.forEach((element) => {
      if (element.relationships.parent === undefined) {
        let children = this.getNestedChildren(elements, element);
        if (children.length > 0) {
          element.children = children;
        }
        tree.push(element);
      }
    });
    return tree;
  }

  private getNestedChildren(elements: ExtArea[], parent: Area): ExtArea[] {
    let areas = [];
    elements.forEach((element) => {
      if (element.relationships.parent !== undefined && element.relationships.parent.data.id === parent.id) {
        let children = this.getNestedChildren(elements, element);
        if (children.length > 0) {
          element.children = children;
        }
        areas.push(element);
      }
    });
    return areas;
  }

  // Transform filtered flat array into tree list

  private buildFilteredTree(elements: ExtArea[]): ExtArea[] {
    // Reassign filtered parents using closest ancestor
    elements.forEach((element) => {
      element.children = undefined;
      if (element.relationships.parent !== undefined) {
        let area = this.getClosestAncestor(elements,
          this.getArea(element.relationships.parent.data.id));
        if (area !== undefined) {
          element.relationships.parent.data = area;
        } else {
          element.relationships.parent = undefined;
        }
      }
    });
    return this.buildTree(elements);
  }

  private getClosestAncestor(elements: ExtArea[], parent: Area): Area {
    let area;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].id === parent.id) {
        area = parent;
        break;
      }
    }
    if (area === undefined && parent.relationships.parent !== undefined) {
      area = this.getClosestAncestor(elements,
        this.getArea(parent.relationships.parent.data.id));
    }
    return area;
  }

  private getArea(id: string): Area {
    let area;
    for (let i = 0; i < this.allAreas.length; i++) {
      if (this.allAreas[i].id === id) {
        area = this.allAreas[i];
      }
    }
    return area;
  }

  // Actions

  handleAction($event: Action, node: Node): void {
    if ($event.id === 'addChildArea') {
      this.addChildArea(node.data.id);
    } else if ($event.id === 'addArea') {
      this.addChildArea(this.defaultArea);
    }
  }
}
