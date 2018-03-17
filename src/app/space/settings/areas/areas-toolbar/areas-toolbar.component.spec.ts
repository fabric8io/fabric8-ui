import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import {
  FilterEvent,
  SortEvent
} from 'patternfly-ng';

import {
  initContext,
  TestContext
} from 'testing/test-context';

import { AreasToolbarComponent } from './areas-toolbar.component';

@Component({
  template: `<areas-toolbar
  (onFilterChange)="filterChange($event)"
  (onSortChange)="sortChange($event)"
  [resultsCount]="resultsCount">
  </areas-toolbar>`
})
class HostComponent {
  public resultsCount = 0;
  public filterChange($event: FilterEvent) { }
  public sortChange($event: SortEvent) { }
}

@Component({
  selector: 'pfng-toolbar',
  template: ''
})
class FakePfngToolbarComponent {
  @Input() config: any;
  @Input() viewTemplate: any;
  @Output() onFilterChange = new EventEmitter<FilterEvent>();
  @Output() onSortChange = new EventEmitter<SortEvent>();
}

describe('AreasToolbarComponent', () => {
  type Context = TestContext<AreasToolbarComponent, HostComponent>;
  initContext(AreasToolbarComponent, HostComponent,
  {
    declarations: [FakePfngToolbarComponent],
    imports: [RouterTestingModule]
  });

  it('should update filterConfig resultsCount', function(this: Context) {
    let initialCount = 0;
    expect(this.testedDirective.filterConfig.resultsCount).toBe(initialCount);

    let nextCount = 5;
    this.hostComponent.resultsCount = nextCount;
    this.detectChanges();

    expect(this.testedDirective.filterConfig.resultsCount).toBe(nextCount);
  });
});
