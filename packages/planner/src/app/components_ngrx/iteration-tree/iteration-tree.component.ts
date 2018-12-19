import { Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { GroupTypeUI } from '../../models/group-types.model';
import { IterationUI } from '../../models/iteration.model';
import { IterationListEntryComponent } from '../iteration-list-entry/iteration-list-entry.component';

@Component({
  selector: 'iteration-tree',
  templateUrl: './iteration-tree.component.html',
})
export class IterationTreeComponent {
  @Input() iterationList: IterationUI[] = [];
  @Input() collection: any;
  @Input() witGroup: GroupTypeUI;
  @Input() showTree: string = '';
  @Input() showCompleted: string = '';
  @Input() context: 'list' | 'board'; // 'list' or 'board'

  @Output() readonly onEditIteration = new EventEmitter<IterationUI>();
  @Output() readonly onCloseIteration = new EventEmitter<IterationUI>();
  @Output() readonly onCreateIteration = new EventEmitter<IterationUI>();

  editIteration(iteration) {
    this.onEditIteration.emit(iteration);
  }

  closeIteration(iteration) {
    this.onCloseIteration.emit(iteration);
  }

  createIteration(iteration) {
    this.onCreateIteration.emit(iteration);
  }
}
