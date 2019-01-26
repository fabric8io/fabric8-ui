import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterEvent } from 'patternfly-ng/filter';
import { SortEvent } from 'patternfly-ng/sort';
import { MockFeatureToggleComponent } from 'testing/mock-feature-toggle.component';
import { initContext } from 'testing/test-context';
import { MySpacesToolbarComponent } from './my-spaces-toolbar.component';

@Component({
  template: `
    <my-spaces-toolbar
      (onFilterChange)="filterChange($event)"
      (onSortChange)="sortChange($event)"
      [resultsCount]="resultsCount"
    >
    </my-spaces-toolbar>
  `,
})
class TestHostComponent {
  public resultsCount: number = 0;

  public filterChange(event: FilterEvent): void {}

  public sortChange(event: SortEvent): void {}
}

@Component({
  selector: 'pfng-toolbar',
  template: '',
})
class FakePfngToolbarComponent {
  @Input() config: any;

  @Input() actionTemplate: any;

  @Input() viewTemplate: any;

  @Output() onFilterChange = new EventEmitter<FilterEvent>();

  @Output() onSortChange = new EventEmitter<SortEvent>();
}

describe('MySpacesToolbarComponent', () => {
  const testContext = initContext(MySpacesToolbarComponent, TestHostComponent, {
    declarations: [FakePfngToolbarComponent, MockFeatureToggleComponent],
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
