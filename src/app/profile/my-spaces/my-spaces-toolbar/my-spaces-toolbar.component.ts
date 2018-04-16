import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { FilterConfig, FilterEvent, FilterField } from 'patternfly-ng/filter';
import { SortConfig, SortEvent } from 'patternfly-ng/sort';
import { ToolbarConfig } from 'patternfly-ng/toolbar';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'my-spaces-toolbar',
  styleUrls: ['./my-spaces-toolbar.component.less'],
  templateUrl: './my-spaces-toolbar.component.html'
})
export class MySpacesToolbarComponent implements OnInit, OnChanges {
  @Input() resultsCount: number = 0;

  @Output('onCreateSpace') onCreateSpace = new EventEmitter();
  @Output('onFilterChange') onFilterChange = new EventEmitter();
  @Output('onSortChange') onSortChange = new EventEmitter();

  @ViewChild('addCodebaseTemplate') addCodebaseTemplate: TemplateRef<any>;

  filterConfig: FilterConfig;
  isAscendingSort: boolean = true;
  sortConfig: SortConfig;
  toolbarConfig: ToolbarConfig;

  constructor() {
  }

  // Initialization

  ngOnInit(): void {
    this.filterConfig = {
      fields: [{
        id: 'name',
        title: 'Name',
        placeholder: 'Filter by Name...',
        type: 'text'
      }] as FilterField[],
      appliedFilters: [],
      resultsCount: 0,
      selectedCount: 0,
      totalCount: 0
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resultsCount && this.filterConfig) {
      this.filterConfig.resultsCount = changes.resultsCount.currentValue;
    }
  }

  // Actions

  createSpace($event: MouseEvent): void {
    this.onCreateSpace.emit($event);
  }

  filterChange($event: FilterEvent): void {
    this.onFilterChange.emit($event);
  }

  sortChange($event: SortEvent): void {
    this.onSortChange.emit($event);
  }
}
