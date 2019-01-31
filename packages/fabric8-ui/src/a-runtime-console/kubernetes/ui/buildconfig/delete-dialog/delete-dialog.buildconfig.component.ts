import { Component } from '@angular/core';
import { BuildConfig } from '../../../model/buildconfig.model';
import { BuildConfigService } from '../../../service/buildconfig.service';
import { BuildConfigStore } from '../../../store/buildconfig.store';

@Component({
  selector: 'delete-buildconfig-dialog',
  templateUrl: './delete-dialog.buildconfig.component.html',
  styleUrls: ['./delete-dialog.buildconfig.component.less'],
})
export class BuildConfigDeleteDialog {
  buildconfig: BuildConfig = new BuildConfig();

  modal: any;

  constructor(
    private buildconfigService: BuildConfigService,
    private buildconfigStore: BuildConfigStore,
  ) {}

  ok() {
    this.modal.close();
    const stream = this.buildconfigService.delete(this.buildconfig);
    if (stream) {
      stream.subscribe(
        () => {
          //
        },
        (err) => {
          console.log('delete failed: ', err);
          this.buildconfigStore.loadAll();
        },
        () => {
          this.buildconfigStore.loadAll();
        },
      );
    } else {
      this.buildconfigStore.loadAll();
    }
  }

  close() {
    this.modal.close();
  }
}
