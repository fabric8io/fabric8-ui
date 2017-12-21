import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import { Environment } from '../models/environment';

import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';

import {
  Filter,
  FilterEvent,
  SortEvent,
  SortField
} from 'patternfly-ng';

@Component({
  selector: 'deployments-apps',
  templateUrl: 'deployments-apps.component.html'
})
export class DeploymentsAppsComponent implements OnInit {

  @Input() public applications: Observable<string[]>;
  @Input() public environments: Observable<Environment[]>;
  @Input() public spaceId: Observable<string>;

  public filteredApplicationsList: string[];
  public resultsCount: number = 0;

  private applicationsList: string[];
  private currentFilters: Filter[];
  private currentSortField: SortField;
  private isAscendingSort: boolean = true;

  public constructor() { }

  ngOnInit(): void {
    this.applications.subscribe(applications => {
      this.applicationsList = applications;
      this.applyFilters();
    });
  }

  filterChange($event: FilterEvent): void {
    this.currentFilters = $event.appliedFilters;
    this.applyFilters();
  }

  sortChange($event: SortEvent): void {
    this.currentSortField = $event.field;
    this.isAscendingSort = $event.isAscending;

    this.filteredApplicationsList.sort((a: string, b: string) => {
      let v: number = a.localeCompare(b);
      if (!this.isAscendingSort) {
        v = v * -1;
      }

      return v;
    });
  }

  applyFilters(): void {
    this.filteredApplicationsList = [];
    if (this.currentFilters && this.currentFilters.length > 0) {
      this.applicationsList.forEach((application: string) => {
        if (this.matchesFilters(application, this.currentFilters)) {
          this.filteredApplicationsList.push(application);
        }
      });
    } else {
      this.filteredApplicationsList = cloneDeep(this.applicationsList);
    }

    this.resultsCount = this.filteredApplicationsList.length;
  }

  matchesFilters(application: string, filters: Filter[]): boolean {
    let match: boolean = true;
    filters.forEach((filter: Filter) => {
      if (!this.matchesFilter(application, filter)) {
        match = false;
      }
    });

    return match;
  }

  matchesFilter(application: string, filter: Filter): boolean {
    let match: boolean = false;
    if (filter.field.id === 'applicationId') {
      match = application.match(filter.value) !== null;
    }

    return match;
  }
}
