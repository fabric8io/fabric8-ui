import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';

import { Observable } from 'rxjs';

// import { Logger } from '../../node_modules/ngx-login-client';

import { StackAnalysesService } from '../stack-analyses.service';

import { GlobalConstants } from '../constants/constants.service';
import { getStackRecommendations, getResultInformation } from '../utils/stack-api-utils';

@Component({
  selector: 'stack-details',
  templateUrl: './stack-details.component.html',
  styleUrls: ['./stack-details.component.scss'],
  providers: [
    StackAnalysesService
  ],
  encapsulation: ViewEncapsulation.None
})
/**
 * StackDetailsComponent - Provides the detailed analysis for the given codebase
 * by giving recommendation, overview and information about the dependencies of their packages
 *
 * implements OnInit
 *
 * Selector: 'stack-details'
 * Template: stack-details.component.html
 * Style: stack-details.component.scss
 *
 * Services:
 * 1. AddWorkFlowService
 * 2. Logger
 * 3. StackAnalysesService
 *
 * Parent component that includes,
 * 1. Recommendations
 * 2. Overview
 * 3. Components/Dependencies
 *
 * Hits the Stack Analysis Service, gets the response
 * Passes the tailored response to each of the children.
 */
export class StackDetailsComponent implements OnInit {
  @Input() stack;
  @Input() displayName;
  @Input() repoInfo;

  @ViewChild('stackModule') modalStackModule: any;
  public messages: any;

  errorMessage: any = {};
  stackAnalysesData: Array<any> = [];
  componentAnalysesData: any = {};
  mode: string = 'Observable';

  componentDataObject: any = {};
  componentsDataTable: Array<any> = [];

  currentIndex: number = 0;

  similarStacks: Array<any> = [];
  workItemRespMsg: string = '';

  workItemData: any = {};
  multilpeActionData: any = {};

  buildId: string = '';
  isLoading: boolean = true;

  modalHeader: string = null;

  private stackReport = {};
  private recommendations: Array<any> = [];
  private dependencies: Array<any> = [];
  private stackOverviewData: any = {};
  private paths: Array<string> = [];
  private currentManifestPath: string = '';

  constructor(
    private stackAnalysesService: StackAnalysesService,
    private constants: GlobalConstants
  ) {
    this.constants.getMessages('stackDetails').subscribe((message) => {
      this.messages = message;
    });
  }

  ngOnInit() {
    if (this.stack) {
      this.setBuildId();
    }
    this.displayName = this.displayName || 'Stack Reports';
  }

  public showStackModal(event: Event): void {
    event.preventDefault();
    this.modalStackModule.open();
  }

  /**
   * Gets triggered on close of modal,
   * Clears the existing states to make it proper on open
   */
  public handleModalClose(): void {
    this.resetFields();
  }

  private resetFields(): void {
    this.stackReport = {};
    this.recommendations = [];
    this.stackOverviewData = [];
    this.dependencies = [];
  }

  /**
   * getRecommendationActions - takes nothing and returns an Array<any>
   * This function returns the static Array of objects that are to be used
   * as actions for each recommendation.
   */
  private getRecommendationActions(): Array<any> {
    return [
      {
        itemName: 'Create WorkItem',
        identifier: 'CREATE_WORK_ITEM'
      }
    ];
  }

  private setBuildId(): void {
    let currentStackUrl: string = this.stack;
    let splitForBuildId: string = currentStackUrl.split('/stack-analyses/')[1];
    if (splitForBuildId) {
      let splitLen: number = splitForBuildId.length;
      if (splitForBuildId[splitLen - 1] === '/') {
        splitForBuildId = splitForBuildId.substring(0, splitLen - 1);
      }
      this.buildId = splitForBuildId;
    }
  }

  /**
   * setRecommendations - takes missing (Array), version (Array) and returns nothing.
   * This function gets the missing packages information and version mismatch information
   * Displays the information accordingly on screen
   */
  private setRecommendations(path: string, recommendation: any): void {
    let missing: Array<any> = recommendation['missing'] || [];
    let version: Array<any> = recommendation['version'] || [];
    let stackName: string = recommendation['stackName'] || 'An existing stack';
    let fileName: string = this.stackReport[path]['stackOverviewData']['fileName'];
    let recommendations = [];
    for (let i in missing) {
      if (missing.hasOwnProperty(i)) {
        let key: any = Object.keys(missing[i]);
        recommendations.push({
          suggestion: 'Recommended',
          action: 'Add',
          message: key[0] + ' : ' + missing[i][key[0]],
          subMessage: stackName + ' has this dependency included',
          key: key[0],
          workItem: {
            action: 'Add ' + key[0] + ' with version ' + missing[i][key[0]],
            message: 'Stack analytics has identified a potential missing library. It\'s ' +
            'recommended that you add "' + key[0] + '" with version ' + missing[i][key[0]] +
            ' to your application as many other Vert.x OpenShift applications have it included',
            codebase: {
              'repository': 'Test_Repo',
              'branch': 'task-1234',
              'filename': fileName,
              'linenumber': 1
            }
          },
          pop: this.getRecommendationActions()
        });
      }
    }

    for (let i in version) {
      if (version.hasOwnProperty(i)) {
        let key: any = Object.keys(version[i]);
        recommendations.push({
          suggestion: 'Recommended',
          action: 'Update',
          message: key[0] + ' : ' + version[i][key[0]],
          subMessage: stackName + ' has a different version of dependency',
          workItem: {
            action: 'Update ' + key[0] + ' with version ' + version[i][key[0]],
            message: 'Stack analytics has identified a potential version upgrade. It\'s ' +
            'recommended that you upgrade "' + key[0] + '" with version ' + version[i][key[0]] +
            ' to your application as many other Vert.x OpenShift applications have it included',
            codebase: {
              'repository': 'Exciting',
              'branch': 'task-101',
              'filename': fileName,
              'linenumber': 1
            }
          },
          pop: this.getRecommendationActions()
        });
      }
    }

    this.stackReport[path]['recommendations'] = recommendations;
  }

  private setDependencies(path: string, stackData: any): void {
    this.stackReport[path]['dependencies'] = stackData['components'];
  }

  private setOverviewData(path: string, stackData: any): void {
    let components = stackData['components'];
    // set the default values - start
    let noOfComponents: number = components ? components.length : 0;
    let totalCycloComplexity: number = 0;
    let avgCycloComplexity: any = 'NA';
    let validComponentsWithCycloValue: number = 0;
    let totalNoOfLines: number = 0;
    let totalNoOfFiles: number = 0;
    let cvssObj: any = {
      id: '',
      value: -1 // -1 to say that no package is vulnerable
    };
    let licenseList: Array<string> = [];
    // set the default values - end
    components.forEach(item => {
      totalNoOfFiles += item.code_metrics.total_files;
      totalNoOfLines += item.code_metrics.code_lines;
      if (item.code_metrics.average_cyclomatic_complexity !== -1) {
        totalCycloComplexity += item.code_metrics.average_cyclomatic_complexity;
        validComponentsWithCycloValue += 1;
      }

      if (item.security && item.security.vulnerabilities && item.security.vulnerabilities[0].cvss) {
        let value = parseFloat(item.security.vulnerabilities[0].cvss);
        if (value > cvssObj.value) {
          cvssObj.value = value;
          cvssObj.id = item.security.vulnerabilities[0].id;
        }
      }
      if (item.licenses && item.licenses.length) {
        licenseList = [...licenseList, ...item.licenses];
      }
    });
    if (validComponentsWithCycloValue > 0) {
      avgCycloComplexity =
        Math.round(totalCycloComplexity / validComponentsWithCycloValue * 1000) / 1000;
    }
    this.stackReport[path]['stackOverviewData'] = {
      noOfComponents: noOfComponents,
      totalNoOfFiles: totalNoOfFiles,
      totalNoOfLines: totalNoOfLines,
      avgCycloComplexity: avgCycloComplexity,
      cvss: cvssObj,
      licenseList: licenseList,
      fileName: stackData['manifest']
    };
  }

  /**
   * getStackAnalyses - takes an id (string) and returns nothing.
   * This hits the service and gets the response and passes it on to different functions.
   */
  private getStackAnalyses(url: string): void {
    if (!url) return;
    this.isLoading = true;
    let stackAnalysesData: any = {};
    this.errorMessage = {};
    this.stackAnalysesService
      .getStackAnalyses(url)
      .subscribe(data => {
        // Enter the actual scene only if the data is valid and the data
        // has something inside.
        this.clearLoader();
        this.modalHeader = 'Updated just now';
        if (data && (!data.hasOwnProperty('error') && Object.keys(data).length !== 0)) {
          let result: any;
          let components: Array<any> = [];

          let stackDataObservable: Observable<any> = getResultInformation(data);
          let recObservable: Observable<any> = getStackRecommendations(data);
          Observable
            .zip(
            stackDataObservable, recObservable
            )
            .subscribe(([stackDatas, recommendations]) => {
              if (stackDatas) {
                for (let path in stackDatas) {
                  if (path && stackDatas.hasOwnProperty(path)) {
                    this.stackReport[path] = {};
                    // Call the stack-components with the components information so that
                    // It can parse the necessary information and show relevant things.
                    this.setDependencies(path, stackDatas[path]);

                    // set the overview data
                    this.setOverviewData(path, stackDatas[path]);
                  }
                }
              }
              if (recommendations) {
                for (let path in recommendations) {
                  if (path && path !== 'undefined' && path !== 'widget_data'
                  && recommendations.hasOwnProperty(path)) {
                    // Call the recommendations with the recommendations response object
                    this.setRecommendations(path, recommendations[path]);
                  }
                }
              }
              this.paths = Object.keys(this.stackReport);
              this.currentManifestPath = this.paths[0];
              this.selectedManifestPath();
              console.log('Final stack Report object', this.stackReport);
            });
        } else {
          // Set an error if the data is invalid or not proper.
          this.errorMessage.message = `This could take a while. Return to pipeline to keep
           working or stay on this screen to review progress.`;
          this.modalHeader = 'Updating ...';
        }
      },
      error => {
        this.clearLoader();
        // Throw error when the service fails
        this.errorMessage.message = error.message;
        this.errorMessage.status = error.status;
        this.errorMessage.statusText = error.statusText;
        this.modalHeader = 'Report failed ...';
      });
  }

  private clearLoader(): void {
    this.isLoading = false;
  }

  private selectedManifestPath(): void {
    this.dependencies = this.stackReport[this.currentManifestPath]['dependencies'];
    this.stackOverviewData = this.stackReport[this.currentManifestPath]['stackOverviewData'];
    this.recommendations = this.stackReport[this.currentManifestPath]['recommendations'];
  }

}
