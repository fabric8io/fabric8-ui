import { Component } from '@angular/core';
import { Pod } from '../../../model/pod.model';
import { PodService } from '../../../service/pod.service';
import { PodStore } from '../../../store/pod.store';

@Component({
  selector: 'delete-pod-dialog',
  templateUrl: './delete-dialog.pod.component.html'
})
export class PodDeleteDialog {
  pod: Pod = new Pod();
  modal: any;

  constructor(private podService: PodService, private podStore: PodStore) {
  }

  ok() {
    console.log('deleting pod ' + this.pod.name);
    this.modal.close();
    this.podService.delete(this.pod).subscribe(
      () => {
        this.podStore.loadAll();
      }
    );
  }

  close() {
    this.modal.close();
  }
}
