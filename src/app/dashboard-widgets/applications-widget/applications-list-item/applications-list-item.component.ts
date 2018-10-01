import {
  Component,
  DoCheck,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { isEmpty } from 'lodash';
import { Contexts } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BuildConfig } from '../../../../a-runtime-console/index';
import { Build, isValidInputAction } from '../../../../a-runtime-console/kubernetes/model/build.model';
import { PipelineStage } from '../../../../a-runtime-console/kubernetes/model/pipelinestage.model';
import { InputActionDialog } from '../../../../a-runtime-console/kubernetes/ui/pipeline/input-action-dialog/input-action-dialog.component';
import { ApplicationsStackReportComponent } from '../applications-stack-report/applications-stack-report.component';

export class BuildInput {
  build: Build;
  stage: PipelineStage;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-applications-list-item',
  templateUrl: './applications-list-item.component.html'
})
export class ApplicationsListItemComponent implements DoCheck, OnInit {
  @Input() buildConfig: BuildConfig;

  @ViewChild('stackReport') stackReport: ApplicationsStackReportComponent;

  @ViewChild(InputActionDialog) inputActionDialog: InputActionDialog;

  contextPath: Observable<string>;
  expanded: boolean = false;

  private _applicationUrl: string;
  private _pipelineStages: PipelineStage[];
  private _promoteBuildInput: BuildInput;

  constructor(private context: Contexts) {
    this.contextPath = this.context.current.pipe(map(context => context.path));
  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    this.initApplicationUrl();
    this.initPipelineStages();
    this.initPromoteBuildInput();
  }

  /**
   * Returns last application URL
   */
  get applicationUrl(): string {
    return this._applicationUrl;
  }

  /**
   * Returns flag indicating pipeline is available
   */
  get pipelineAvailable(): boolean {
    return !isEmpty(this._pipelineStages);
  }

  /**
   * Returns the last build where input is required
   */
  get promoteBuildInput(): BuildInput {
    return this._promoteBuildInput;
  }

  // Promote build to the next environment
  promoteBuild(): void {
    const input = this.promoteBuildInput;
    if (input === undefined) {
      return;
    }
    let inputAction = input.build.firstPendingInputAction;
    if (isValidInputAction(inputAction) && input.build.jenkinsNamespace) {
      this.inputActionDialog.build = input.build;
      this.inputActionDialog.inputAction = inputAction;
      this.inputActionDialog.stage = input.stage;
      this.inputActionDialog.proceed();
    }
  }

  /**
   * Open the stack report module from fabric8-stack-analysis-ui
   */
  showStackReport($event: MouseEvent): void {
    if (this.stackReport !== undefined) {
      this.stackReport.showStackReport();
    }
  }

  /**
   * Toggle expansion area
   */
  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  // Private

  // Initialize last application URL -- 'run' has priority over 'stage' environment
  private initApplicationUrl(): void {
    this._applicationUrl = undefined;
    if (this.buildConfig.interestingBuilds === undefined) {
      return;
    }
    for (let i = 0; i < this.buildConfig.interestingBuilds.length; i++) {
      let build = this.buildConfig.interestingBuilds[i];
      if (build.pipelineStages !== undefined) {
        for (let k = build.pipelineStages.length - 1; k >= 0; k--) {
          let stage = build.pipelineStages[k];
          if (stage.serviceUrl !== undefined) {
            this._applicationUrl = stage.serviceUrl;
            return;
          }
        }
      }
    }
  }

  // Initialize pipeline stages
  private initPipelineStages(): void {
    this._pipelineStages = undefined;
    if (this.buildConfig.interestingBuilds === undefined) {
      return;
    }
    for (let i = 0; i < this.buildConfig.interestingBuilds.length; i++) {
      let build = this.buildConfig.interestingBuilds[i];
      if (build.pipelineStages !== undefined) {
        if (build.pipelineStages.length > 0) {
          this._pipelineStages = build.pipelineStages;
          return;
        }
      }
    }
  }

  // Initialize the last build where input is required
  private initPromoteBuildInput(): void {
    this._promoteBuildInput = undefined;
    if (this.buildConfig.interestingBuilds === undefined) {
      return;
    }
    for (let i = 0; i < this.buildConfig.interestingBuilds.length; i++) {
      let build = this.buildConfig.interestingBuilds[i];
      if (build.pipelineStages !== undefined) {
        for (let k = build.pipelineStages.length - 1; k >= 0; k--) {
          let stage = build.pipelineStages[k];
          if (stage.jenkinsInputURL !== undefined) {
            this._promoteBuildInput = {
              build: build,
              stage: stage
            };
            return;
          }
        }
      }
    }
  }
}
