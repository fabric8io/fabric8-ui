import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Modal } from 'ngx-modal';
import { Codebase } from '../services/codebase';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebase-delete-dialog',
  templateUrl: './codebase-delete-dialog.component.html',
  styleUrls: ['./codebase-delete-dialog.component.less']
})
export class CodebaseDeleteDialogComponent implements OnInit, OnDestroy {
  @Input() codebase: Codebase;
  @Input() host: Modal;
  @Output() onDelete = new EventEmitter<Codebase>();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  /**
   * Confirm deletion of the codebase.
   */
  confirmDelete () {
    this.onDelete.emit(this.codebase);
  }

  /**
   * Cancel and close the dialog.
   */
  cancel() {
    this.host.close();
  }
}
