import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { FilterEvent } from 'patternfly-ng/filter';
import { SortEvent } from 'patternfly-ng/sort';
import { initContext, TestContext } from '../../../../testing/test-context';

import { MySpacesToolbarComponent } from './my-spaces-toolbar.component';

@Component({
  template: `
    <my-spaces-toolbar
      (onFilterChange)="filterChange($event)"
      (onSortChange)="sortChange($event)"
      [resultsCount]="resultsCount">
    </my-spaces-toolbar>
  `
})
class TestHostComponent {
  public resultsCount: number = 0;
  public filterChange(event: FilterEvent): void { }
  public sortChange(event: SortEvent): void { }
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

describe('MySpacesToolbarComponent', () => {
  type Context = TestContext<MySpacesToolbarComponent, TestHostComponent>;
  initContext(MySpacesToolbarComponent, TestHostComponent, {
    declarations: [FakePfngToolbarComponent]
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
