import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Logger } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';

import { Stack } from './../../../models/stack';
import { StackAnalysesService } from '../stack-analyses.service';
import { StackAnalysesModel } from '../stack-analyses.model';
import { RenderNextService } from './render-next-service';
import { AddWorkFlowService } from './add-work-flow.service';
import { PagerService } from '../pager.service';

@Component({
  selector: 'stack-details',
  templateUrl: './stack-details.component.html',
  styleUrls: ['./stack-details.component.scss'],
  providers: [AddWorkFlowService,
              Logger,
              PagerService,
              RenderNextService,
              StackAnalysesService,
              StackAnalysesModel],
  encapsulation: ViewEncapsulation.None
})

export class StackDetailsComponent implements OnInit {

  @Input() stack: Stack;
  @ViewChild('workItemRespModal') modal: any;

  errorMessage: string;
  stackAnalysesData: Array<any> = [];
  componentAnalysesData: any = {};
  mode = 'Observable';

  requiredEngines = {};
  requiredEnginesArr = [];

  componentDataObject = {};
  componentsDataTable = [];

  currentStackRows: Array<any> = [];
  currentStackHeaders: Array<string> = [];

  recoArray: Array<any> = [];
  currentIndex: number = 0;

  similarStacks: Array<any> = [];
  workItemRespMsg: string = '';

  workItemData: any = {};
  multilpeActionData: any = {};
  multiRecommendMsg: string = '';

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  public recommendationForm = this.fb.group({
    row: ["[{name: 'Sample1', version: '0.1.1', custom: '{name: 'Add'}'}]"]
  });

  private stackAnalysisRawData: any = {};

  private recommendations: Array<any> = [];


  constructor(
    public fb: FormBuilder,
    private addWorkFlowService: AddWorkFlowService,
    private pagerService: PagerService,
    private renderNextService: RenderNextService,
    private stackAnalysesService: StackAnalysesService,
    private stackAnalysesModel: StackAnalysesModel,
    private logger: Logger
  ) { }

  ngOnInit() {
    this.getStackAnalyses(this.stack.uuid);
    this.setStackAnalysisRawData();

    this.recommendations = [
      {
        suggestion: 'Recommended1',
        action: 'Upgrade',
        message: 'Vertx Web applications have different version',
        pop: [
          {
            itemName: 'Create WorkItem',
            identifier: 'CREATE_WORK_ITEM'
          }, {
            itemName: 'Dismiss Recommendation',
            identifier: 'DISMISS'
          }
        ]
      },
      {
        suggestion: 'Recommended2',
        action: 'Downgrade',
        message: 'Vertx Web applications have different version',
        pop: [
          {
            itemName: 'Create WorkItem',
            identifier: 'CREATE_WORK_ITEM'
          }, {
            itemName: 'Dismiss Recommendation',
            identifier: 'DISMISS'
          }
        ]
      },
      {
        suggestion: 'Recommended3',
        action: 'Remove',
        message: 'Vertx Web applications have different version',
        pop: [
          {
            itemName: 'Create WorkItem',
            identifier: 'CREATE_WORK_ITEM'
          }, {
            itemName: 'Dismiss Recommendation',
            identifier: 'DISMISS'
          }
        ]
      }, {
        suggestion: 'Recommended4',
        action: 'Upgrade',
        message: 'Vertx Web applications have different version',
        pop: [
          {
            itemName: 'Create WorkItem',
            identifier: 'CREATE_WORK_ITEM'
          }, {
            itemName: 'Dismiss Recommendation',
            identifier: 'DISMISS'
          }
        ]
      },
      {
        suggestion: 'Recommended5',
        action: 'Downgrade',
        message: 'Vertx Web applications have different version',
        pop: [
          {
            itemName: 'Create WorkItem',
            identifier: 'CREATE_WORK_ITEM'
          }, {
            itemName: 'Dismiss Recommendation',
            identifier: 'DISMISS'
          }
        ]
      },
      {
        suggestion: 'Recommended6',
        action: 'Remove',
        message: 'Vertx Web applications have different version',
        pop: [
          {
            itemName: 'Create WorkItem',
            identifier: 'CREATE_WORK_ITEM'
          }, {
            itemName: 'Dismiss Recommendation',
            identifier: 'DISMISS'
          }
        ]
      }
    ];

    // initialize to page 1
    // this.setPage(1);

    this.currentStackHeaders = [
      'name',
      'version',
      'action'
    ];

    this.currentStackRows = [
      { name: 'Sample1', version: '0.1.1' },
      { name: 'Sample1', version: '0.1.1' },
      { name: 'Sample1', version: '0.1.1' },
      { name: 'Sample1', version: '0.1.1' }
    ];

    this.recoArray = [
      {
        'headers': [
          'Name',
          'Version',
          'Action'
        ],
        'rows': [
          { name: 'Sample1', version: '0.1.1' },
          { name: 'Sample1', version: '0.1.1' },
          { name: 'Sample1', version: '0.1.1' },
          { name: 'Sample1', version: '0.1.1' }
        ]
      }
    ];
  }

  private setStackAnalysisRawData(): void {
    this.stackAnalysisRawData = {
      packageName: '',
      packageVersion: '',
      averageUsage: 'NA',
      lowPublicUsageComponents: 'NA',
      redhatDistributedComponents: 'NA',
      averageStars: '',
      averageForks: '',
      lowPopularityComponents: '',
      distinctLicenses: '',
      totalLicenses: '',
      totalSecurityIssues: 'NA',
      cvss: 'NA',
      componentsWithTests: 'NA',
      componentsWithDependencyLockFile: 'NA'
    };
  }

  private getWorkItemData(): any {
    this.workItemData = {
      'data': {
        'attributes': {
          'system.state': 'new',
          'system.title': '',
          'system.description': 'Relevant description goes here.'
        },
        'relationships':
        {
          'baseType': {
            'data':
            { 'id': 'userstory', 'type': 'workitemtypes' }
          }
        },
        'type': 'workitems', 'id': '55'
      }
    };
    return this.workItemData;
  }

  /* Adding Single Work item */
  private addWorkItem(row: any): void {
    let workItemData: any = this.getWorkItemData();

    workItemData.data.attributes['system.title']
     = row.custom.name + ' ' + row.name + ' ' + row.version;

    let workflow: Observable<any> = this.addWorkFlowService.addWorkFlow(workItemData);
    workflow.subscribe((data) => {
      let baseUrl: string = 'http://demo.almighty.io/work-item/list/detail/' + data.data.id;
      this.showModal(baseUrl);
    });
  }
  /* Adding Single Work item */
  private addSelectedItem(row: any): void {
    if (row.name in this.multilpeActionData) {
        delete this.multilpeActionData[row.name];
    } else {
      this.multilpeActionData[row.name] = row;
    }
  }

  /* Get Recommendation */
  private getRecommendations(components: any, recommendation: any): void {
    this.similarStacks = recommendation.similar_stacks;
    const analysis: any = this.similarStacks[0].analysis;
    let missingPackages: Array<any> = analysis.missing_packages;
    let versionMismatch: Array<any> = analysis.version_mismatch;

    const url: string = this.similarStacks[0].uri;
    this.recoArray[this.currentIndex]['rows'] = [];
    this.recoArray[this.currentIndex]['url'] = url;
    for (let component in components) {
      if (components.hasOwnProperty(component)) {
        this.recoArray[this.currentIndex]['rows'].push({ name: components[component].name,
          version: components[component].version });
      }
    }
    for (let i in missingPackages) {
      if (missingPackages.hasOwnProperty(i)) {
        this.recoArray[this.currentIndex]['rows'].push({
          'name': i,
          'version': missingPackages[i],
          'custom': {
            'name': 'Add',
            'type': 'checkbox'
          }
        });
      }
    }
    for (let i in versionMismatch) {
      if (versionMismatch.hasOwnProperty(i)) {
        this.recoArray[this.currentIndex]['rows'].push({
          'name': i,
          'version': versionMismatch[i],
          'custom': {
            'name': 'Update',
            'type': 'checkbox'
          }
        });
      }
    }
  }


  private getComponents(components): void {
    this.currentStackRows = [];
    for (let component in components) {
      if (components.hasOwnProperty(component)) {
        this.currentStackRows.push({ name: components[component].name,
          version: components[component].version });
      }
    }
  }

  // TODO: To be removed after the demo
  private fetchStaticRecommendation(): any {
    return {
            'recommendations': {
                'similar_stacks': [
                    {
                        'analysis': {
                            'version_mismatch': {
                                'vertx:vertx-web-templ-freemarker': '3.3.4',
                                'vertx:vertx-web-templ-mvel': '3.4.0'
                            },
                            'missing_packages': {
                                'vertx:vertx-mongo-embedded-db': '3.3.3'
                            }
                        },
                        'similarity': 0.7009090909090909,
                        'uri': 'http://cucos-01.lab.eng.brq.redhat.com:32100/api/v1.0/appstack/18'
                    }
                ]
            }
        };
  }

  private setComponentsToGrid(stackData: any): void {
    let components: Array<any> = stackData.components;
    let length: number = components.length;
    for (let i = 0; i < length; i++) {
      let myObj: any = {};
      myObj.ecosystem = components[i].ecosystem;
      myObj.pkg = components[i].name;
      myObj.version = components[i].version;
      myObj.latestVersion = components[i].latest_version;
      myObj.publicUsage = components[i].dependents_count;
      myObj.relativePublicUsage = components[i].relative_usage;
      myObj.popularity = '';
      if (components[i].github_details.forks_count) {
        myObj.popularity = components[i].github_details.forks_count
                            + '/'
                            + components[i].github_details.stargazers_count;
      }

      myObj.redhatUsage = '';
      myObj.licence = components[i].licenses[0];
      this.componentsDataTable.push(myObj);
    }
  }

  private setStackMetrics(stackData: any): void {
    this.stackAnalysisRawData.packageName = stackData.name;
    this.stackAnalysisRawData.packageVersion = stackData.version;
    if (stackData.usage) {
      this.stackAnalysisRawData.averageUsage = stackData.usage.average_usage;
      this.stackAnalysisRawData.lowPublicUsageComponents
      = stackData.usage.low_public_usage_components;
      this.stackAnalysisRawData.redhatDistributedComponents
      = stackData.usage.redhat_distributed_components;
    }


    this.stackAnalysisRawData.averageStars = stackData.popularity.average_stars;
    this.stackAnalysisRawData.averageForks = stackData.popularity.average_forks;

    this.stackAnalysisRawData.lowPopularityComponents
     = stackData.popularity.low_popularity_components;

    this.stackAnalysisRawData.distinctLicenses = stackData.distinct_licenses;
    this.stackAnalysisRawData.totalLicenses = stackData.total_licenses;

    if (stackData.total_security_issues)
    this.stackAnalysisRawData.totalSecurityIssues = stackData.total_security_issues;

    if (stackData.cvss)
    this.stackAnalysisRawData.cvss = stackData.cvss;

    if (stackData.metadata) {
    this.stackAnalysisRawData.componentsWithTests = stackData.metadata.components_with_tests;
    this.stackAnalysisRawData.componentsWithDependencyLockFile
     = stackData.metadata.components_with_dependency_lock_file;
    this.stackAnalysisRawData.requiredEngines = stackData.metadata.required_engines;
    }

    for (let key in this.requiredEngines) {
      if (this.requiredEngines.hasOwnProperty(key)) {
        this.requiredEnginesArr.push({ key: key, value: this.requiredEngines[key] });
      }
    }
  }

  private getStackAnalyses(id: string) {
    let stackAnalysesData: any = {};
    this  .stackAnalysesService
          .getStackAnalyses(id)
          .subscribe(data => {
            stackAnalysesData = data;
            if (Object.prototype.toString.call(stackAnalysesData) !== '[object Array]') {
              stackAnalysesData = stackAnalysesData.result[0];
            } else {
              stackAnalysesData = stackAnalysesData[0];
            }

            if (!stackAnalysesData.recommendation) {
              // Add static recommendations here in case recommendations are not fetched
              // from the API
              // Solely for Demo purpose and to be removed later.
              stackAnalysesData['recommendation'] = this.fetchStaticRecommendation();
            }

            this.getRecommendations(stackAnalysesData.components,
              stackAnalysesData.recommendation.recommendations);

            this.getComponents(stackAnalysesData.components);
            this.setStackMetrics(stackAnalysesData);
            this.setComponentsToGrid(stackAnalysesData);
      },
      error => this.errorMessage = <any>error
      );
  }

  private handleNext(value: any): void {
    // ++ this.currentIndex;
    // Hit a new Ajax call and populate the Array
    let nextObservable: Observable<any>
    = this.renderNextService.getNextList(this.recoArray[this.currentIndex]['url']);
    nextObservable.subscribe((data) => {
      this.logger.log(data);
    });
  }

  private handlePrevious(value: any): void {
    --this.currentIndex;
  }

  // make workitem api call with multiple recommendation //
  private multipleRecoWorkItem(rows: any): void {
    let workItemData: any = this.getWorkItemData();

    for (let row in rows) {
      if (rows.hasOwnProperty(row)) {
        workItemData.data.attributes['system.title'] += rows[row].custom.name + ' '
        + rows[row].name + ' ' + rows[row].version;
      }
    }
    let workflow: Observable<any> = this.addWorkFlowService.addWorkFlow(workItemData);
    workflow.subscribe((data) => {
      let baseUrl: string = 'http://demo.almighty.io/work-item/list/detail/' + data.data.id;
      this.multiRecommendMsg = baseUrl;
    });
  }

  // process recomendation form //
  private addMultipleWorkItem(event: any): void {
    event.preventDefault();
    this.multipleRecoWorkItem(this.multilpeActionData);
  }

   private showModal(baseUrl: string): void {
    this.workItemRespMsg = baseUrl;
    this.modal.open();
  }

  private setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.recommendations.length, page);

        // get current page of items
        this.pagedItems = this.recommendations.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

}
