import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { initContext } from 'testing/test-context';

import { DeploymentsToolbarComponent } from './deployments-toolbar.component';

@Component({
  template: `
    <deployments-toolbar
      (onFilterChange)="filterChange($event)"
      (onSortChange)="sortChange($event)"
      [resultsCount]="resultsCount"
    >
    </deployments-toolbar>
  `,
})
class TestHostComponent {
  resultsCount: number = 0;
  filterChange(): void {}
  sortChange(): void {}
}

describe('DeploymentsToolbarComponent', (): void => {
  const testContext = initContext(DeploymentsToolbarComponent, TestHostComponent, {
    schemas: [NO_ERRORS_SCHEMA],
  });

  it('should update filterConfig resultsCount', (): void => {
    const initialCount: number = 0;
    expect(testContext.testedDirective.filterConfig.resultsCount).toBe(initialCount);

    const nextCount: number = 5;
    testContext.hostComponent.resultsCount = nextCount;
    testContext.detectChanges();

    expect(testContext.testedDirective.filterConfig.resultsCount).toBe(nextCount);
  });

  it('should emit filterChange event', (): void => {
    spyOn(testContext.hostComponent, 'filterChange');
    testContext.testedDirective.filterChange({});
    expect(testContext.hostComponent.filterChange).toHaveBeenCalledWith({});
  });

  it('should emit sortChange event', (): void => {
    spyOn(testContext.hostComponent, 'sortChange');
    testContext.testedDirective.sortChange({
      field: {
        sortType: 'alphanumeric',
      },
      isAscending: false,
    });
    expect(testContext.hostComponent.sortChange).toHaveBeenCalledWith({
      field: {
        sortType: 'alphanumeric',
      },
      isAscending: false,
    });
  });
});
