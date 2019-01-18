import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Delete } from '../../actions/work-item.actions';
import { PermissionQuery } from '../../models/permission.model';
import { WorkItemUI } from '../../models/work-item';
import { ModalService } from '../../services/modal.service';
import { AppState } from '../../states/app.state';

@Component({
  selector: 'f8-delete-workitem',
  templateUrl: './delete-work-item.component.html',
  styleUrls: ['./delete-work-item.component.less'],
})
export class DeleteWorkItemComponent {
  @Input('workItem') set workItemInput(val: WorkItemUI) {
    if (val) {
      this.workItem = val;
      this.allowDelete = this.permissionQuery.isAllowedToDelete(val);
    }
  }
  @Input() detailContext: string = '';

  @Output() readonly onDelete: EventEmitter<any> = new EventEmitter();

  allowDelete: Observable<boolean>;
  workItem: WorkItemUI;

  constructor(
    private modalService: ModalService,
    private store: Store<AppState>,
    private permissionQuery: PermissionQuery,
  ) {}

  deleteWorkItem(event: MouseEvent): void {
    let note = 'Are you sure you want to delete this work item?';
    if (this.workItem.hasChildren) {
      note = 'This work item has children. ' + note;
    }
    this.modalService
      .openModal('Delete Work Item', note, 'Delete', 'deleteWorkItem')
      .pipe(first())
      .subscribe((actionKey: string) => {
        if (actionKey === 'deleteWorkItem') {
          this.onDelete.emit();
          this.store.dispatch(new Delete(this.workItem));
        }
      });
  }
}
