import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FilterConfig, FilterEvent, FilterField, FilterType } from 'patternfly-ng/filter';
import { SortConfig, SortEvent } from 'patternfly-ng/sort';
import { ToolbarConfig } from 'patternfly-ng/toolbar';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'deployments-toolbar',
  templateUrl: './deployments-toolbar.component.html',
  styleUrls: ['./deployments-toolbar.component.less'],
})
export class DeploymentsToolbarComponent implements OnChanges, OnInit {
  static readonly APPLICATION_ID: string = 'applicationId';

  @Input() resultsCount: number;

  @Output('onFilterChange') onFilterChange: EventEmitter<FilterEvent> = new EventEmitter<
    FilterEvent
  >();
  @Output('onSortChange') onSortChange: EventEmitter<SortEvent> = new EventEmitter<SortEvent>();

  filterConfig: FilterConfig;
  isAscendingSort: boolean = true;
  sortConfig: SortConfig;
  toolbarConfig: ToolbarConfig;

  ngOnInit(): void {
    this.filterConfig = {
      appliedFilters: [],
      fields: [
        {
          id: DeploymentsToolbarComponent.APPLICATION_ID,
          placeholder: 'Filter by Application Name...',
          title: 'Application Name',
          type: FilterType.TEXT,
        },
      ] as FilterField[],
      resultsCount: 0,
    };

    this.sortConfig = {
      fields: [
        {
          id: DeploymentsToolbarComponent.APPLICATION_ID,
          sortType: 'alpha',
          title: 'Application Name',
        },
      ],
      isAscending: this.isAscendingSort,
    };

    this.toolbarConfig = {
      filterConfig: this.filterConfig,
      sortConfig: this.sortConfig,
      views: undefined,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resultsCount && this.filterConfig) {
      this.filterConfig.resultsCount = changes.resultsCount.currentValue;
    }
  }

  filterChange(event: FilterEvent): void {
    this.onFilterChange.emit(event);
  }

  sortChange(event: SortEvent): void {
    this.onSortChange.emit(event);
  }
}
