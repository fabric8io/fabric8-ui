import {
  Component,
  ElementRef, EventEmitter,
  HostBinding,
  OnInit, Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {
  ActionConfig,
  EmptyStateConfig
} from 'patternfly-ng';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'workspace-not-found',
  templateUrl: './workspace-not-found.component.html',
  styleUrls: ['./workspace-not-found.component.less']
})
export class WorkspaceNotFoundComponent implements OnInit {
  @HostBinding('class.workspace-not-found')
  @ViewChild('filterEmptyState', {read: ElementRef}) filterEmptyStateRef: ElementRef;
  @Output() onClearAllFilters = new EventEmitter();

  filtersEmptyStateConfig: EmptyStateConfig;

  // Initialization

  ngOnInit(): void {
    this.filtersEmptyStateConfig = {
      actions: {
        primaryActions: [{
          id: 'action1',
          title: 'Clear All Filters',
          tooltip: 'Clear All Filters'
        }],
        moreActions: []
      } as ActionConfig,
      title: '',
      info: 'No results match the filter criteria'
    } as EmptyStateConfig;

    const intervalId = setInterval(() => {
      if (!this.filterEmptyStateRef || !this.filterEmptyStateRef.nativeElement) {
        return;
      }
      clearInterval(intervalId);
      this.filterEmptyStateRef.nativeElement
        .querySelector('button')
        .classList
        .replace('btn-primary', 'btn-link');
    }, 10);
  }

  clearAllFilters(): void {
    this.onClearAllFilters.emit();
  }

}
