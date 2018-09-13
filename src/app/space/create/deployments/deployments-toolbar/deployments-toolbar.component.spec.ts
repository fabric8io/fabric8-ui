import {
  Component,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { FilterEvent } from 'patternfly-ng/filter';
import { SortEvent } from 'patternfly-ng/sort';
import { initContext, TestContext } from 'testing/test-context';
import { DeploymentsToolbarComponent } from './deployments-toolbar.component';

@Component({
  template: `
    <deployments-toolbar
      (onFilterChange)="filterChange($event)"
      (onSortChange)="sortChange($event)"
      [resultsCount]="resultsCount">
    </deployments-toolbar>
  `
})
class TestHostComponent {
  resultsCount: number = 0;
  filterChange(event: FilterEvent): void { }
  sortChange(event: SortEvent): void { }
}

describe('DeploymentsToolbarComponent', () => {
  type Context = TestContext<DeploymentsToolbarComponent, TestHostComponent>;
  initContext(DeploymentsToolbarComponent, TestHostComponent, {
    schemas: [NO_ERRORS_SCHEMA]
  });

  it('should update filterConfig resultsCount', function(this: Context) {
    const initialCount: number = 0;
    expect(this.testedDirective.filterConfig.resultsCount).toBe(initialCount);

    const nextCount: number = 5;
    this.hostComponent.resultsCount = nextCount;
    this.detectChanges();

    expect(this.testedDirective.filterConfig.resultsCount).toBe(nextCount);
  });

  it('should emit filterChange event', function(this: Context) {
    spyOn(this.hostComponent, 'filterChange');
    this.testedDirective.filterChange({});
    expect(this.hostComponent.filterChange).toHaveBeenCalledWith({});
  });

  it('should emit sortChange event', function(this: Context) {
    spyOn(this.hostComponent, 'sortChange');
    this.testedDirective.sortChange({
      field: {
        sortType: 'alphanumeric'
      },
      isAscending: false
    });
    expect(this.hostComponent.sortChange).toHaveBeenCalledWith({
      field: {
        sortType: 'alphanumeric'
      },
      isAscending: false
    });
  });
});
