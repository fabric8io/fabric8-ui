import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {
  Filter,
  FilterConfig,
  FilterEvent,
  FilterField,
  SortConfig,
  SortEvent,
  SortField,
  ToolbarConfig
} from 'ngx-widgets';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'toolbar-panel',
  templateUrl: './toolbar-panel.component.html',
  styleUrls: ['./toolbar-panel.component.scss']
})
export class ToolbarPanelComponent implements OnInit {
  @Input('items') allItems: any[];

  @Output('onAddClick') onAddClick = new EventEmitter();
  @Output('onFilterChange') onFilterChange = new EventEmitter();
  @Output('onSortChange') onSortChange = new EventEmitter();

  @ViewChild('add') addTemplate: TemplateRef<any>;

  currentSortField: SortField;
  filterConfig: FilterConfig;
  isAscendingSort: boolean = true;
  items: any[];
  sortConfig: SortConfig;
  toolbarConfig: ToolbarConfig;

  constructor() {
  }

  ngOnInit() {
    this.items = this.allItems;

    this.filterConfig = {
      fields: [{
        id: 'name',
        title: 'Name',
        placeholder: 'Filter by Name...',
        type: 'text'
      }] as FilterField[],
      appliedFilters: [],
      resultsCount: -1, // Hide
      selectedCount: 0,
      totalCount: 0,
      tooltipPlacement: 'right'
    } as FilterConfig;

    this.sortConfig = {
      fields: [{
          id: 'name',
          title:  'Name',
          sortType: 'alpha'
      }],
      isAscending: this.isAscendingSort
    } as SortConfig;

    this.toolbarConfig = {
      filterConfig: this.filterConfig,
      sortConfig: this.sortConfig
    } as ToolbarConfig;
  }

  // Filter functions

  applyFilters(filters: Filter[]): void {
    this.items = [];
    if (filters && filters.length > 0) {
      this.allItems.forEach((item) => {
        if (this.matchesFilters(item, filters)) {
          this.items.push(item);
        }
      });
    } else {
      this.items = this.allItems;
    }
    this.toolbarConfig.filterConfig.resultsCount = this.items.length;
  }

  filterChange($event: FilterEvent): void {
    this.applyFilters($event.appliedFilters);
  }

  matchesFilter(item: any, filter: Filter): boolean {
    let match = true;

    if (filter.field.id === 'name') {
      match = item.name.match(filter.value) !== null;
    }
    return match;
  }

  matchesFilters(item: any, filters: Filter[]): boolean {
    let matches = true;

    filters.forEach((filter) => {
      if (!this.matchesFilter(item, filter)) {
        matches = false;
        return false;
      }
    });
    return matches;
  }

  // Sort functions

  compare(item1: any, item2: any): number {
    var compValue = 0;
    if (this.currentSortField.id === 'name') {
      compValue = item1.name.localeCompare(item2.name);
    }
    if (!this.isAscendingSort) {
      compValue = compValue * -1;
    }
    return compValue;
  }

  sortChange($event: SortEvent): void {
    this.currentSortField = $event.field;
    this.isAscendingSort = $event.isAscending;
    this.items.sort((item1: any, item2: any) => this.compare(item1, item2));
  }

  // Add button

  onClick($event: MouseEvent): void {
    this.onAddClick.emit($event);
  }
}
