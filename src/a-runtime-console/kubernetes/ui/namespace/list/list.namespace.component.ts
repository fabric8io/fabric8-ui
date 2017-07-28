import {Component, Input, ViewChild} from "@angular/core";
import {Namespaces} from "../../../model/namespace.model";
import {NamespaceDeleteDialog} from "../delete-dialog/delete-dialog.namespace.component";
import {ParentLinkFactory} from "../../../../common/parent-link-factory";

@Component({
  selector: 'fabric8-namespaces-list',
  templateUrl: './list.namespace.component.html',
  styleUrls: ['./list.namespace.component.scss'],
})
export class NamespacesListComponent {
  parentLink: string;

  @Input() namespaces: Namespaces;

  @Input() loading: boolean;

  @Input() hideCheckbox: boolean;

  @ViewChild(NamespaceDeleteDialog) deleteDialog: NamespaceDeleteDialog;

  constructor(parentLinkFactory: ParentLinkFactory) {
    this.parentLink = parentLinkFactory.parentLink;

  }
  openDeleteDialog(deleteNamespaceModal, namespace) {
    this.deleteDialog.modal = deleteNamespaceModal;
    this.deleteDialog.namespace = namespace;
    deleteNamespaceModal.open();
  }
}
