import {
  Component,
  DoCheck,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { cloneDeep } from 'lodash';
import { Build } from '../../../../a-runtime-console/kubernetes/model/build.model';
import { PipelineStage } from '../../../../a-runtime-console/kubernetes/model/pipelinestage.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-applications-stack-report',
  templateUrl: './applications-stack-report.component.html',
  styleUrls: ['./applications-stack-report.component.less']
})
export class ApplicationsStackReportComponent implements DoCheck, OnInit {
  @Input() build: Build;

  @ViewChild('stackReport') stackReport: ElementRef;

  private _pipelineStages: PipelineStage[];
  private prevStatusPhase: string;

  constructor() {
  }

  ngOnInit(): void {
    this.initPipelineStages();
  }

  ngDoCheck(): void {
    // Don't update upon build duration changes
    if (this.prevStatusPhase !== this.build.statusPhase) {
      this.initPipelineStages();
      this.prevStatusPhase = this.build.statusPhase;
    }
  }

  get pipelineStages(): PipelineStage[] {
    return this._pipelineStages;
  }

  /**
   * Open the stack report module from fabric8-stack-analysis-ui
   */
  showStackReport(): void {
    let el = this.stackReport.nativeElement.querySelector('a.stack-reports-btn');
    if (el !== undefined) {
      el.click();
    }
  }

  // Private

  private initPipelineStages(): void {
    this._pipelineStages = cloneDeep(this.build.pipelineStages);
  }
}
