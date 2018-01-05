import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import {
  FilterConfig,
  FilterEvent,
  FilterField,
  FilterType,
  SortConfig,
  SortEvent,
  ToolbarConfig
} from 'patternfly-ng';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'deployments-toolbar',
  templateUrl: './deployments-toolbar.component.html'
})
export class DeploymentsToolbarComponent implements OnChanges, OnInit {

  public static readonly APPLICATION_ID: string = 'applicationId';

  public filterConfig: FilterConfig;
  public isAscendingSort: boolean = true;

  @Output('onFilterChange') public onFilterChange: EventEmitter<FilterEvent> = new EventEmitter<FilterEvent>();
  @Output('onSortChange') public onSortChange: EventEmitter<SortEvent> = new EventEmitter<SortEvent>();

  @Input() public resultsCount: number;

  private sortConfig: SortConfig;
  private toolbarConfig: ToolbarConfig;

  public constructor() { }

  public filterChange($event: FilterEvent): void {
    this.onFilterChange.emit($event);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.resultsCount && this.filterConfig) {
      this.filterConfig.resultsCount = changes.resultsCount.currentValue;
    }
  }

  public ngOnInit(): void {
    this.filterConfig = {
      appliedFilters: [],
      fields: [{
        id: DeploymentsToolbarComponent.APPLICATION_ID,
        placeholder: 'Filter by Application Name...',
        title: 'Application Name',
        type: FilterType.TEXT
      }] as FilterField[],
      resultsCount: 0
    };

    this.sortConfig = {
      fields: [{
        id: DeploymentsToolbarComponent.APPLICATION_ID,
        sortType: 'alpha',
        title: 'Application Name'
      }],
      isAscending: this.isAscendingSort
    };

    this.toolbarConfig = {
      filterConfig: this.filterConfig,
      sortConfig: this.sortConfig,
      views: undefined
    };
  }

  public sortChange($event: SortEvent): void {
    this.onSortChange.emit($event);
  }

}
