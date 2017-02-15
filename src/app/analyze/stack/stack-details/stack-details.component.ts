import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Logger } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';

import { Stack } from './../../../models/stack';
import { StackAnalysesService } from '../stack-analyses.service';
import { StackAnalysesModel } from '../stack-analyses.model';
import { RenderNextService } from './render-next-service';
import { AddWorkFlowService } from './add-work-flow.service';

@Component({
  selector: 'stack-details',
  templateUrl: './stack-details.component.html',
  styleUrls: ['./stack-details.component.scss'],
  providers: [AddWorkFlowService, RenderNextService, StackAnalysesService,
    StackAnalysesModel, Logger],
  encapsulation: ViewEncapsulation.None
})

export class StackDetailsComponent implements OnInit {

  @Input() stack: Stack;

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

  public recommendationForm = this.fb.group({
    row: ["[{name: 'Sample1', version: '0.1.1', custom: '{name: 'Add'}'}]"]
  });

  private stackAnalysisRawData: any = {};


  constructor(
    public fb: FormBuilder,
    private addWorkFlowService: AddWorkFlowService,
    private renderNextService: RenderNextService,
    private stackAnalysesService: StackAnalysesService,
    private stackAnalysesModel: StackAnalysesModel,
    private logger: Logger
  ) { }

  ngOnInit() {
    this.getStackAnalyses(this.stack.uuid);
    this.setStackAnalysisRawData();

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
      averageUsage: '',
      lowPublicUsageComponents: '',
      redhatDistributedComponents: '',
      averageStars: '',
      averageForks: '',
      lowPopularityComponents: '',
      distinctLicenses: '',
      totalLicenses: '',
      totalSecurityIssues: '',
      cvss: '',
      componentsWithTests: '',
      componentsWithDependencyLockFile: ''
    };
  }


  /* Modal - TODO: Make it Angular2, For now it is in Plain Javascript */

  private openModal(modalInformation): void {
    let body: HTMLElement = document.getElementsByTagName('body')[0];
    let modal: Element;

    this.closeModal();

    modal = document.createElement('div');
    modal.classList.add('modal-container');

    let innerModal: Element = document.createElement('div');
    innerModal.classList.add('modal-inner');

    modal.appendChild(innerModal);

    let head: Element = document.createElement('div');
    head.innerHTML = modalInformation.header + '<span class="close_icon">x</span>';
    head.classList.add('modal-head');

    let subject: Element = document.createElement('div');
    subject.innerHTML = modalInformation.subject;
    subject.classList.add('modal-subject');

    innerModal.appendChild(head);
    innerModal.appendChild(subject);

    body.appendChild(modal);

    modal.addEventListener('click', (event) => {
      let tgt: any = event.target;
      if (tgt.classList.contains('close_icon')) {
        this.closeModal();
      }
    });
  }

  private closeModal(): void {
    let body: HTMLElement = document.getElementsByTagName('body')[0];

    let cache: NodeList = document.getElementsByClassName('modal-container');

    if (cache && cache.length > 0) {
      body.removeChild(cache[0]);
    }
  }

  /* Modal */

  /* Adding Single Work item */
  private addWorkItem(row: any): void {
    let workItemData: any = {
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

    workItemData.data.attributes['system.title']
     = row.custom.name + ' ' + row.name + ' ' + row.version;

    let workflow: Observable<any> = this.addWorkFlowService.addWorkFlow(workItemData);
    workflow.subscribe((data) => {
      let baseUrl: string = 'http://demo.almighty.io/work-item/list/detail/' + data.data.id;
      this.openModal({
        header: 'Response for Work item',
        subject: `Successfully created a work item. 
                  You can see it here! <a target="_blank" href="' + baseUrl + '">Link</a>`
      });
    });
  }
  /* Adding Single Work item */

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
    this.stackAnalysisRawData.averageUsage = stackData.usage.average_usage;

    this.stackAnalysisRawData.lowPublicUsageComponents
     = stackData.usage.low_public_usage_components;

    this.stackAnalysisRawData.redhatDistributedComponents
     = stackData.usage.redhat_distributed_components;

    this.stackAnalysisRawData.averageStars = stackData.popularity.average_stars;
    this.stackAnalysisRawData.averageForks = stackData.popularity.average_forks;

    this.stackAnalysisRawData.lowPopularityComponents
     = stackData.popularity.low_popularity_components;

    this.stackAnalysisRawData.distinctLicenses = stackData.distinct_licenses;
    this.stackAnalysisRawData.totalLicenses = stackData.total_licenses;

    this.stackAnalysisRawData.totalSecurityIssues = stackData.total_security_issues;
    this.stackAnalysisRawData.cvss = stackData.cvss;

    this.stackAnalysisRawData.componentsWithTests = stackData.metadata.components_with_tests;

    this.stackAnalysisRawData.componentsWithDependencyLockFile
     = stackData.metadata.components_with_dependency_lock_file;

    this.stackAnalysisRawData.requiredEngines = stackData.metadata.required_engines;
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
            stackAnalysesData = stackAnalysesData[0];

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

  // process recomendation form //
  private processForm(row: any) {
    this.logger.log(event);
    this.logger.log(this.recommendationForm.value);
  }

}
