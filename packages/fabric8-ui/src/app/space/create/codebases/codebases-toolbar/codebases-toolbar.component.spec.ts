import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterEvent } from 'patternfly-ng/filter';
import { SortEvent } from 'patternfly-ng/sort';
import { initContext, TestContext } from 'testing/test-context';
import { CodebasesToolbarComponent } from './codebases-toolbar.component';

@Component({
  template: `
    <codebases-toolbar
      (onFilterChange)="filterChange($event)"
      (onSortChange)="sortChange($event)"
      [resultsCount]="resultsCount"
    >
    </codebases-toolbar>
  `,
})
class HostComponent {
  public resultsCount = 0;

  public filterChange($event: FilterEvent) {}

  public sortChange($event: SortEvent) {}
}

@Component({
  selector: 'pfng-toolbar',
  template: '',
})
class FakePfngToolbarComponent {
  @Input() config: any;

  @Input() viewTemplate: any;

  @Output() onFilterChange = new EventEmitter<FilterEvent>();

  @Output() onSortChange = new EventEmitter<SortEvent>();
}

describe('CodebasesToolbarComponent', () => {
  const testContext = initContext(CodebasesToolbarComponent, HostComponent, {
    declarations: [FakePfngToolbarComponent],
    imports: [RouterTestingModule],
  });

  it('should update filterConfig resultsCount', function() {
    let initialCount = 0;
    expect(testContext.testedDirective.filterConfig.resultsCount).toBe(initialCount);

    let nextCount = 5;
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
