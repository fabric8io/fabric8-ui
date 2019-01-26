import { Component, DoCheck, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { isEmpty } from 'lodash';
import { Build } from '../../../../a-runtime-console/kubernetes/model/build.model';
import { PipelineStage } from '../../../../a-runtime-console/kubernetes/model/pipelinestage.model';

export class ExtPipelineStage extends PipelineStage {
  currentStage: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-applications-list-item-details',
  templateUrl: './applications-list-item-details.component.html',
  styleUrls: ['./applications-list-item-details.component.less'],
})
export class ApplicationsListItemDetailsComponent implements DoCheck, OnInit {
  @Input() build: Build;

  private _pipelineStages: ExtPipelineStage[];

  private prevStatusPhase: string;

  constructor() {}

  ngOnInit(): void {
    this.initStages();
  }

  ngDoCheck(): void {
    // Don't update upon build duration changes
    if (this.prevStatusPhase !== this.build.statusPhase) {
      this.initStages();
      this.prevStatusPhase = this.build.statusPhase;
    }
  }

  get pipelineStages(): ExtPipelineStage[] {
    return this._pipelineStages;
  }

  // Private

  private initStages(): void {
    this._pipelineStages = [];
    if (isEmpty(this.build.pipelineStages)) {
      return;
    }
    if (this.build.pipelineStages.length - 2 > 0) {
      let prevStage = this.build.pipelineStages[
        this.build.pipelineStages.length - 2
      ] as ExtPipelineStage;
      this._pipelineStages.push(prevStage);
    }
    if (this.build.pipelineStages.length - 1 >= 0) {
      let curStage = this.build.pipelineStages[
        this.build.pipelineStages.length - 1
      ] as ExtPipelineStage;
      curStage.currentStage = true;
      this._pipelineStages.push(curStage);
    }
    if (this.build.statusPhase !== 'Complete') {
      this._pipelineStages.push({} as ExtPipelineStage);
    }
  }
}
