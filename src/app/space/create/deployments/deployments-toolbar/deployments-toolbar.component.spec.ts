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
  const testContext = initContext(DeploymentsToolbarComponent, TestHostComponent, {
    schemas: [NO_ERRORS_SCHEMA]
  });

  it('should update filterConfig resultsCount', function() {
    const initialCount: number = 0;
    expect(testContext.testedDirective.filterConfig.resultsCount).toBe(initialCount);

    const nextCount: number = 5;
    testContext.hostComponent.resultsCount = nextCount;
    testContext.detectChanges();

    expect(testContext.testedDirective.filterConfig.resultsCount).toBe(nextCount);
  });

  it('should emit filterChange event', function() {
    spyOn(testContext.hostComponent, 'filterChange');
    testContext.testedDirective.filterChange({});
    expect(testContext.hostComponent.filterChange).toHaveBeenCalledWith({});
  });

  it('should emit sortChange event', function() {
    spyOn(testContext.hostComponent, 'sortChange');
    testContext.testedDirective.sortChange({
      field: {
        sortType: 'alphanumeric'
      },
      isAscending: false
    });
    expect(testContext.hostComponent.sortChange).toHaveBeenCalledWith({
      field: {
        sortType: 'alphanumeric'
      },
      isAscending: false
    });
  });
});
