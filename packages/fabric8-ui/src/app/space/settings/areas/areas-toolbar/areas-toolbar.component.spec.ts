import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterEvent } from 'patternfly-ng/filter';
import { SortEvent } from 'patternfly-ng/sort';
import { initContext, TestContext } from 'testing/test-context';
import { AreasToolbarComponent } from './areas-toolbar.component';

@Component({
  template: `
    <areas-toolbar
      (onFilterChange)="filterChange($event)"
      (onSortChange)="sortChange($event)"
      [resultsCount]="resultsCount"
    >
    </areas-toolbar>
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

describe('AreasToolbarComponent', () => {
  type Context = TestContext<AreasToolbarComponent, HostComponent>;
  const testContext = initContext(AreasToolbarComponent, HostComponent, {
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
});
