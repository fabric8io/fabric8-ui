import { Component } from '@angular/core';
import { Build } from '../../../model/build.model';
import { BuildService } from '../../../service/build.service';
import { BuildStore } from '../../../store/build.store';

@Component({
  selector: 'delete-build-dialog',
  templateUrl: './delete-dialog.build.component.html'
})
export class BuildDeleteDialog {
  build: Build = new Build();
  modal: any;

  constructor(private buildService: BuildService, private buildStore: BuildStore) {
  }

  ok() {
    console.log('deleting build ' + this.build.name);
    this.modal.close();
    this.buildService.delete(this.build).subscribe(
      () => {
        this.buildStore.loadAll();
      }
    );
  }

  close() {
    this.modal.close();
  }
}
