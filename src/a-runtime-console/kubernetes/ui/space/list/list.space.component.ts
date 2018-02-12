import { Component, Input, ViewChild } from '@angular/core';
import { ParentLinkFactory } from '../../../../common/parent-link-factory';
import { Spaces } from '../../../model/space.model';
import { SpaceDeleteDialog } from '../delete-dialog/delete-dialog.space.component';

@Component({
  selector: 'fabric8-spaces-list',
  templateUrl: './list.space.component.html'
})
export class SpacesListComponent {
  parentLink: string;

  @Input() spaces: Spaces;

  @Input() loading: boolean;

  @Input() hideCheckbox: boolean;

  @ViewChild(SpaceDeleteDialog) deleteDialog: SpaceDeleteDialog;

  constructor(parentLinkFactory: ParentLinkFactory) {
    this.parentLink = parentLinkFactory.parentLink;

  }
  openDeleteDialog(deleteSpaceModal, space) {
    this.deleteDialog.modal = deleteSpaceModal;
    this.deleteDialog.space = space;
    deleteSpaceModal.open();
  }
}
