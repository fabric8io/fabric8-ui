import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { cloneDeep } from 'lodash';
import { Broadcaster } from 'ngx-base';
import { Filter, FilterEvent } from 'patternfly-ng/filter';
import { SortEvent } from 'patternfly-ng/sort';
import {
  forkJoin,
  Observable,
  Subscription
} from 'rxjs';
import { first, map } from 'rxjs/operators';
import { DeploymentsToolbarComponent } from '../deployments-toolbar/deployments-toolbar.component';

@Component({
  selector: 'deployments-apps',
  templateUrl: 'deployments-apps.component.html',
  styleUrls: ['./deployments-apps.component.less']
})
export class DeploymentsAppsComponent implements OnInit, OnDestroy {

  @Input() applications: Observable<string[]>;
  @Input() environments: Observable<string[]>;
  @Input() spaceId: Observable<string>;
  @Input() spaceName: Observable<string>;
  @Output() addToSpace = new EventEmitter();

  filteredApplicationsList: string[];
  resultsCount: number = 0;
  hasLoaded: Observable<boolean>;

  private applicationsList: string[];
  private currentFilters: Filter[];
  private isAscendingSort: boolean = true;
  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly broadcaster: Broadcaster) { }

  ngOnInit(): void {
    this.hasLoaded = forkJoin(
      this.applications.pipe(first()),
      this.environments.pipe(first())
    ).pipe(map((): boolean => true));
    this.subscriptions.push(
      this.applications.subscribe((applications: string[]): void => {
        this.applicationsList = applications;
        this.applyFilters();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription): void => sub.unsubscribe());
  }

  filterChange(event: FilterEvent): void {
    this.currentFilters = event.appliedFilters;
    this.applyFilters();

    this.sortApplications();
  }

  sortChange(event: SortEvent): void {
    this.isAscendingSort = event.isAscending;

    this.sortApplications();
  }

  sortApplications(): void {
    this.filteredApplicationsList.sort((a: string, b: string) => {
      let v: number = a.localeCompare(b);
      if (!this.isAscendingSort) {
        return -v;
      }
      return v;
    });
  }

  applyFilters(): void {
    this.filteredApplicationsList = [];
    if (this.currentFilters && this.currentFilters.length > 0) {
      this.applicationsList.forEach((application: string): void => {
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

  showAddAppOverlay(): void {
    this.broadcaster.broadcast('showAddAppOverlay', true);
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'add app opened',
      data: {
        source: 'deployment-apps'
      }
    });
  }

}
