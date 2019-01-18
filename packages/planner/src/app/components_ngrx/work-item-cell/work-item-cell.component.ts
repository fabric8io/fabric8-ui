import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { WorkItem, WorkItemUI } from '../../models/work-item';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'work-item-cell',
  templateUrl: './work-item-cell.component.html',
  styleUrls: ['./work-item-cell.component.less'],
})
export class WorkItemCellComponent {
  constructor() {}
  @Input() col: string;
  @Input() row: object;
  @Input() context: string = 'list';
  @Output() readonly onDetailPreview = new EventEmitter();
  @Output() readonly onQuickPreview = new EventEmitter();
  @Output() readonly clickLabel = new EventEmitter();
  @Output() readonly onChildExploration = new EventEmitter();
  @Output() readonly onDelete = new EventEmitter();

  onDetail(Event: MouseEvent, id: string) {
    this.onDetailPreview.emit(id);
  }

  labelClick(event) {
    this.clickLabel.emit(event);
  }

  onPreview(Event: MouseEvent, workItem: WorkItemUI) {
    this.onQuickPreview.emit(workItem);
  }

  onExploration(workItem: WorkItemUI) {
    if (workItem.hasChildren) {
      this.onChildExploration.emit(workItem);
    }
  }
}
