import { Component } from "@angular/core";
import { Namespace } from "../../../model/namespace.model";
import { NamespaceStore } from "../../../store/namespace.store";
import { NamespaceService } from "../../../service/namespace.service";

@Component({
  selector: 'delete-namespace-dialog',
  templateUrl: './delete-dialog.namespace.component.html',
})
export class NamespaceDeleteDialog {
  namespace: Namespace = new Namespace();
  modal: any;

  constructor(private namespaceService: NamespaceService, private namespaceStore: NamespaceStore) {
  }

  ok() {
    console.log('deleting namespace ' + this.namespace.name);
    this.modal.close();
    this.namespaceService.delete(this.namespace).subscribe(
      () => {
        this.namespaceStore.loadAll();
      },
    );
  }

  close() {
    this.modal.close();
  }
}
