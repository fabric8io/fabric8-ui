import { PipelineStage } from './../../../model/pipelinestage.model';
import { Subscription, Observable } from 'rxjs';
import { Component, Input, ViewChild, OnDestroy } from "@angular/core";
import { Build, isValidInputAction, PendingInputAction } from "../../../model/build.model";
import { InputActionDialog } from "../input-action-dialog/input-action-dialog.component";

@Component({
  selector: 'build-stage-view',
  templateUrl: './build-stage-view.component.html',
  styleUrls: ['./build-stage-view.component.scss'],
})
export class BuildStageViewComponent implements OnDestroy {

  @Input() build: Build;

  @ViewChild(InputActionDialog) inputActionDialog: InputActionDialog;

  displayStages: PipelineStage[] = [];
  private _timerSubscription: Subscription;


  constructor() {
    // Every 200ms check for an update
    this._timerSubscription = Observable
      .timer(0, 200)
      .subscribe(count => {
        for (let i =0; i < this.build.pipelineStages.length; i++) {
          // First, update the displayed stage if needed
          if (!this.build.pipelineStages[i]) {
            // If the stage is null, do nothing
          } else if (this.displayStages.length <= i || !this.displayStages[i]) {
            // If the stage is not yet present, or null, copy in the current value
            this.displayStages[i] = this.build.pipelineStages[i];
          } else if (this.displayStages[i].status !== this.build.pipelineStages[i].status) {
            // If the status changes, then update the view
            this.displayStages[i] = this.build.pipelineStages[i];
            // Set the duration as the status changed
          }
          // Otherwise the status has not changed, so don't update the view

          // COUNTER

          if (this.build.pipelineStages[i].status === 'IN_PROGRESS') {
            // Increment the counter when the build is running
            this.displayStages[i].durationMillis += 200;
          }
        }
      });
  }

  ngOnDestroy() {
    this._timerSubscription.unsubscribe();
  }

  openInputActionDialog(stage) {
    const build = this.build;
    if (!build) {
      return;
    }
    let inputAction = build.firstPendingInputAction;
    if (isValidInputAction(inputAction) && build.jenkinsNamespace) {
      this.inputActionDialog.build = build;
      this.inputActionDialog.inputAction = inputAction;
      this.inputActionDialog.stage = stage;
      this.inputActionDialog.open();
    } else {
      // if no PendingInputAction JSON or jenkins namespace on the Build then lets just open the URL: stage.jenkinsInputURL
      let url = stage.jenkinsInputURL;
      if (url) {
        window.location.href = url;
      }
    }
  }
}
