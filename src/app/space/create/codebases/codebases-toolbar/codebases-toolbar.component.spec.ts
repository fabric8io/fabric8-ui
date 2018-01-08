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

import { CodebasesToolbarComponent } from './codebases-toolbar.component';

@Component({
  template: `<codebases-toolbar
  (onFilterChange)="filterChange($event)"
  (onSortChange)="sortChange($event)"
  [resultsCount]="resultsCount">
  </codebases-toolbar>`
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

describe('CodebasesToolbarComponent', () => {
  type Context = TestContext<CodebasesToolbarComponent, HostComponent>;
  initContext(CodebasesToolbarComponent, HostComponent,
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
