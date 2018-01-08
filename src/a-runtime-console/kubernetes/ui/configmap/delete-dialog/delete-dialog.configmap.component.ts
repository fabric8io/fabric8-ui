import { Component } from '@angular/core';
import { ConfigMap } from '../../../model/configmap.model';
import { ConfigMapService } from '../../../service/configmap.service';
import { ConfigMapStore } from '../../../store/configmap.store';

@Component({
  selector: 'delete-configmap-dialog',
  templateUrl: './delete-dialog.configmap.component.html'
})
export class ConfigMapDeleteDialog {
  configmap: ConfigMap = new ConfigMap();
  modal: any;

  constructor(private configmapService: ConfigMapService, private configmapStore: ConfigMapStore) {
  }

  ok() {
    console.log('deleting configmap ' + this.configmap.name);
    this.modal.close();
    this.configmapService.delete(this.configmap).subscribe(
      () => {
        this.configmapStore.loadAll();
      }
    );
  }

  close() {
    this.modal.close();
  }
}
