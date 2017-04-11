import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';

import { StackAnalysesService } from '../stack-analyses.service';

import { GlobalConstants } from '../constants/constants.service';

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

  private recommendations: Array<any> = [];
  private dependencies: Array<any> = [];
  private stackOverviewData: any = {};

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
  }

  public showStackModal(event: Event): void {
    event.preventDefault();
    this.modalStackModule.open();
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
  private setRecommendations(missing: Array<any>, version: Array<any>): void {
    this.recommendations = [];
    for (let i in missing) {
      if (missing.hasOwnProperty(i)) {
        let key: any = Object.keys(missing[i]);
        this.recommendations.push({
          suggestion: 'Recommended',
          action: 'Add',
          message: key[0] + ' ' + missing[i][key[0]],
          codebase: {
            'repository': 'Test_Repo',
            'branch': 'task-1234',
            'filename': 'package.json',
            'linenumber': 35
          },
          pop: this.getRecommendationActions()
        });
      }
    }

    for (let i in version) {
      if (version.hasOwnProperty(i)) {
        let key: any = Object.keys(version[i]);
        this.recommendations.push({
          suggestion: 'Recommended',
          action: 'Upgrade',
          message: key[0] + ' ' + version[i][key[0]],
          codebase: {
            'repository': 'Exciting',
            'branch': 'task-101',
            'filename': 'package.json',
            'linenumber': 1
          },
          pop: this.getRecommendationActions()
        });
      }
    }
  }

  private setDependencies(components: Array<any>): void {
    this.dependencies = components;
  }

  private setOverviewData(components: Array<any>): void {
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
    this.stackOverviewData = {
      noOfComponents: noOfComponents,
      totalNoOfFiles: totalNoOfFiles,
      totalNoOfLines: totalNoOfLines,
      avgCycloComplexity: avgCycloComplexity,
      cvss: cvssObj,
      licenseList: licenseList
    };
  }

  private setComponentsToGrid(stackData: any): void {
    let components: Array<any> = stackData.components;
    let length: number = components.length;
    for (let i: number = 0; i < length; i++) {
      let myObj: any = {};
      myObj.ecosystem = components[i].ecosystem;
      myObj.pkg = components[i].name;
      myObj.version = components[i].version;
      myObj.latestVersion = components[i].latest_version;
      myObj.publicUsage = components[i].dependents_count;
      myObj.relativePublicUsage = components[i].relative_usage;
      myObj.popularity = '';
      if (components[i].github_details.forks_count) {
        myObj.popularity = components[i].github_details.forks_count;
      }
      if (components[i].github_details.stargazers_count) {
        myObj.popularity += '/'
          + components[i].github_details.stargazers_count;
      }

      myObj.redhatUsage = '';
      myObj.licence = components[i].licenses[0];
      this.componentsDataTable.push(myObj);
    }
  }

  /**
   * getStackAnalyses - takes an id (string) and returns nothing.
   * This hits the service and gets the response and passes it on to different functions.
   */
  private getStackAnalyses(url: string): void {
    if (!url) return;
    this.isLoading = true;
    let stackAnalysesData: any = {};
    this.stackAnalysesService
      .getStackAnalyses(url)
      .subscribe(data => {
        // Enter the actual scene only if the data is valid and the data 
        // has something inside.
        this.clearLoader();
        if (data && Object.keys(data).length !== 0) {
          stackAnalysesData = data;
          let result: any;
          let components: Array<any> = [];

          // Check if the data has results key
          if (stackAnalysesData.hasOwnProperty('result') &&
            stackAnalysesData.result.length > 0) {
            result = stackAnalysesData.result[0];
            if (result.hasOwnProperty('components')) {
              components = result.components;
              // Call the stack-components with the components information so that
              // It can parse the necessary information and show relevant things.
              this.setDependencies(components);

              // set the overview data :-
              this.setOverviewData(components);
            }

            this.setComponentsToGrid(result);
          }

          // Check if the data has recommendation key
          if (stackAnalysesData.hasOwnProperty('recommendation')) {
            let recommendation: any = stackAnalysesData.recommendation.recommendations;
            if (recommendation) {
              this.similarStacks = recommendation.similar_stacks;
              const analysis: any = this.similarStacks[0].analysis;
              let missingPackages: Array<any> = analysis.missing_packages;
              let versionMismatch: Array<any> = analysis.version_mismatch;

              // Call the recommendations with the missing packages 
              // and version mismatches
              this.setRecommendations(missingPackages, versionMismatch);
            }
          }
        } else {
          // Set an error if the data is invalid or not proper.
          this.errorMessage.message = `This could take a while. Return to pipeline to keep
           working or stay on this screen to review progress.`;
          this.errorMessage.stack = '';
        }
      },
      error => {
        // Throw error when the service fails
        this.errorMessage.message = <any>error.message;
        this.errorMessage.stack = <any>error.stack;
      });
  }

  private clearLoader(): void {
    this.isLoading = false;
  }

}
