import { Component } from "@angular/core";
import { BuildConfig } from "../../../model/buildconfig.model";
import { BuildConfigStore } from "../../../store/buildconfig.store";
import { BuildConfigService } from "../../../service/buildconfig.service";

@Component({
  selector: 'delete-buildconfig-dialog',
  templateUrl: './delete-dialog.buildconfig.component.html',
})
export class BuildConfigDeleteDialog {
  buildconfig: BuildConfig = new BuildConfig();
  modal: any;

  constructor(private buildconfigService: BuildConfigService, private buildconfigStore: BuildConfigStore) {
  }

  ok() {
    this.modal.close();
    let stream = this.buildconfigService.delete(this.buildconfig);
    if (stream) {
      stream.subscribe(
        () => {
          //
        },
        (err) => {
          console.log("delete failed: ", err);
          this.buildconfigStore.loadAll();
        },
        () => {
          this.buildconfigStore.loadAll();
        }
      );
    } else {
      this.buildconfigStore.loadAll();
    }
  }

  close() {
    this.modal.close();
  }
}
