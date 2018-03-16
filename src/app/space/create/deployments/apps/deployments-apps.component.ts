import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { cloneDeep } from 'lodash';
import {
  Filter,
  FilterEvent,
  SortEvent,
  SortField
} from 'patternfly-ng';
import {
  Observable,
  Subscription
} from 'rxjs';

import { DeploymentsToolbarComponent } from '../deployments-toolbar/deployments-toolbar.component';
import { Environment } from '../models/environment';
import { DeleteDeploymentModal } from './delete-deployment-modal.component';

@Component({
  selector: 'deployments-apps',
  templateUrl: 'deployments-apps.component.html',
  styleUrls: ['./deployments-apps.component.less']
})
export class DeploymentsAppsComponent implements OnInit, OnDestroy {

  @Input() applications: Observable<string[]>;
  @Input() environments: Observable<Environment[]>;
  @Input() spaceId: Observable<string>;

  filteredApplicationsList: string[];
  resultsCount: number = 0;
  hasLoaded: Observable<boolean>;

  private applicationsList: string[];
  private currentFilters: Filter[];
  private currentSortField: SortField;
  private isAscendingSort: boolean = true;
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.hasLoaded = Observable.forkJoin(this.applications.first(), this.environments.first()).map(() => true);
    this.subscriptions.push(
      this.applications.subscribe((applications: string[]) => {
        this.applicationsList = applications;
        this.applyFilters();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  filterChange(event: FilterEvent): void {
    this.currentFilters = event.appliedFilters;
    this.applyFilters();

    this.sortApplications();
  }

  sortChange(event: SortEvent): void {
    this.currentSortField = event.field;
    this.isAscendingSort = event.isAscending;

    this.sortApplications();
  }

  sortApplications(): void {
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
    if (filter.field.id === DeploymentsToolbarComponent.APPLICATION_ID) {
      match = application.match(filter.value) !== null;
    }

    return match;
  }
}
