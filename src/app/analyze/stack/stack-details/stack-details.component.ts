import { Stack } from './../../../models/stack';
import { ComponentAnalysesService } from './../component-analyses.service';
import { Component, OnInit, Input } from '@angular/core';

import { StackAnalysesService } from '../stack-analyses.service';
import { StackAnalysesModel } from '../stack-analyses.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RenderComponentService } from './render-component.service';
import {RenderNextService} from './render-next-service';
import {AddWorkFlowService} from './add-work-flow.service';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'stack-details',
  templateUrl: './stack-details.component.html',
  styleUrls: ['./stack-details.component.css'],
  providers: [AddWorkFlowService, RenderNextService, StackAnalysesService, StackAnalysesModel, RenderComponentService, ComponentAnalysesService]
})

export class StackDetailsComponent implements OnInit {

  @Input() stack: Stack;

  errorMessage: string;
  stackAnalysesData: {};
  componentAnalysesData: {};
  mode = 'Observable';
  average_usage = '';
  low_public_usage_components = '';
  redhat_distributed_components = '';

  average_stars = '';
  average_forks = '';
  low_popularity_components = '';

  distinct_licenses = '';
  total_licenses = '';

  total_security_issues = '';
  cvss = '';

  components_with_tests = '';
  components_with_dependency_lock_file = '';
  required_engines = {}
  required_enginesArr = [];

  componentDataObject = {};
  componentsDataTable = [];

  currentStackRows : Array<any> = [];
  currentStackHeaders : Array<string> = [];

  recoArray : Array<any> = [];
  currentIndex : number = 0;

  similar_stacks: Array<any> = [];

  public recomendationForm = this.fb.group({
    row: ["[{name: 'Sample1', version: '0.1.1', custom: '{name: 'Add'}'}]"]
  });
  constructor(
    public fb: FormBuilder,
    private addWorkFlowService : AddWorkFlowService,
    private renderNextService : RenderNextService,
    private stackAnalysesService: StackAnalysesService,
    private stackAnalysesModel: StackAnalysesModel,
    private renderComponentService: ComponentAnalysesService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getStackAnalyses(this.stack.uuid);


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


    /* Modal - TODO: Make it Angular2, For now it is in Plain Javascript */

  openModal(modalInformation) : void {
    let body : HTMLElement = document.getElementsByTagName('body')[0];
    let modal : Element;

    this.closeModal();

    modal = document.createElement('div');
    modal.classList.add('modal-container');

    let innerModal : Element = document.createElement('div');
    innerModal.classList.add('modal-inner');

    modal.appendChild(innerModal);

    let head : Element = document.createElement('div');
    head.innerHTML = modalInformation.header + '<span class="close_icon">x</span>';
    head.classList.add('modal-head');

    let subject : Element = document.createElement('div');
    subject.innerHTML = modalInformation.subject;
    subject.classList.add('modal-subject');

    innerModal.appendChild(head);
    innerModal.appendChild(subject);

    body.appendChild(modal);

    modal.addEventListener('click', (event) => {
      let tgt : any = event.target;
      if(tgt.classList.contains('close_icon')) {
        this.closeModal();
      }
    });
  }

  closeModal() : void {
    let body : HTMLElement = document.getElementsByTagName('body')[0];

    let cache : NodeList = document.getElementsByClassName('modal-container');

    if(cache && cache.length > 0) {
      body.removeChild(cache[0]);
    }
  }

  /* Modal */

  /* Adding Single Work item */
  addWorkItem(row : any) : void {
    let workItemData : any = {"data":{"attributes":{"system.state":"new","system.title":"Sample Test","system.description":"Sample Description to test"},"relationships":{"baseType":{"data":{"id":"userstory","type":"workitemtypes"}}},"type":"workitems","id":"55"}};
    workItemData.data.attributes["system.title"] = row.custom.name + ' ' + row.name + ' ' + row.version;
    let workflow : Observable<any> = this.addWorkFlowService.addWorkFlow(workItemData);
    workflow.subscribe((data) => {
      console.log(data);
      let baseUrl : string = 'http://demo.almighty.io/work-item/list/detail/' + data.data.id;
      this.openModal({
        header: 'Response for Work item',
        subject: 'Successfully created a work item. You can see it here! <a target="_blank" href="' + baseUrl + '">Link</a>'
      });
    });
  }
  /* Adding Single Work item */

  /* Get Recommendation */
  getRecommendations(components, recommendation : any) : void {
    console.log('Inside');
    console.log(recommendation);
    this.similar_stacks = recommendation.similar_stacks;
    const analysis : any = this.similar_stacks[0].analysis;
    let missing_packages : Array<any> = analysis.missing_packages;
    let version_mismatch : Array<any> = analysis.version_mismatch;

    const url : string = this.similar_stacks[0].uri;
    this.recoArray[this.currentIndex]['rows'] = [];
    this.recoArray[this.currentIndex]['url'] = url;
    for (var component in components) {
      this.recoArray[this.currentIndex]['rows'].push({ name: components[component].name, version: components[component].version });
    }
    for(let i in missing_packages) {
      this.recoArray[this.currentIndex]['rows'].push({
        'name': missing_packages[i],
        'version': '',
        'custom': {
          'name': 'Add',
          'type': 'checkbox'
        }
      });
    }
    for(let i in version_mismatch) {
      this.recoArray[this.currentIndex]['rows'].push({
        'name': version_mismatch[i],
        'version': '',
        'custom': {
          'name': 'Update',
          'type': 'checkbox'
        }
      });
    }
  }


  getComponents(components) : void {
    this.currentStackRows = [];
    for (var component in components) {
      this.currentStackRows.push({ name: components[component].name, version: components[component].version });
    }
  }



  private getStackAnalyses(id: string) {
    this.stackAnalysesService.getStackAnalyses(id)
      .subscribe(
      stackAnalysesData => {
        this.stackAnalysesData = stackAnalysesData;

        this.getRecommendations(this.stackAnalysesData[0].components, this.stackAnalysesData[0].recommendation.recommendations);
        this.getComponents(this.stackAnalysesData[0].components);


        this.average_usage = this.stackAnalysesData[0].usage.average_usage;
        this.low_public_usage_components = this.stackAnalysesData[0].usage.low_public_usage_components;
        this.redhat_distributed_components = this.stackAnalysesData[0].usage.redhat_distributed_components;

        this.average_stars = this.stackAnalysesData[0].popularity.average_stars;
        this.average_forks = this.stackAnalysesData[0].popularity.average_forks;
        this.low_popularity_components = this.stackAnalysesData[0].popularity.low_popularity_components;

        this.distinct_licenses = this.stackAnalysesData[0].distinct_licenses;
        this.total_licenses = this.stackAnalysesData[0].total_licenses;

        this.total_security_issues = this.stackAnalysesData[0].total_security_issues;
        this.cvss = this.stackAnalysesData[0].cvss;

        this.components_with_tests = this.stackAnalysesData[0].metadata.components_with_tests;
        this.components_with_dependency_lock_file  = this.stackAnalysesData[0].metadata.components_with_dependency_lock_file;
        this.required_engines = this.stackAnalysesData[0].metadata.required_engines;
        for (var key in this.required_engines) {
          //////debugger;
          this.required_enginesArr.push({ key: key, value: this.required_engines[key] });
        }

        for (var i = 0; i < this.stackAnalysesData[0].components.length; i++) {
          var myObj = Object.assign({}, this.stackAnalysesModel);
          myObj.ecosystem = this.stackAnalysesData[0].components[i].ecosystem;
          myObj.pkg = this.stackAnalysesData[0].components[i].name;
          myObj.version = this.stackAnalysesData[0].components[i].version;
          myObj.latestVersion = this.stackAnalysesData[0].components[i].latest_version;
          myObj.publicUsage = this.stackAnalysesData[0].components[i].dependents_count;
          myObj.relativePublicUsage = this.stackAnalysesData[0].components[i].relative_usage;
          if (this.stackAnalysesData[0].components[i].github_details.forks_count) {
            myObj.popularity = this.stackAnalysesData[0].components[i].github_details.forks_count + "/" + this.stackAnalysesData[0].components[i].github_details.stargazers_count;
          } else {
            myObj.popularity = '';
          }

          myObj.redhatUsage = '';
          myObj.licence = this.stackAnalysesData[0].components[i].licenses[0];
          this.componentsDataTable.push(myObj);
        }

      },
      error => this.errorMessage = <any>error
      );
  }

  handleNext(value) : void {
    //++ this.currentIndex;
    //Hit a new Ajax call and populate the Array
    let nextObservable : Observable<any> = this.renderNextService.getNextList(this.recoArray[this.currentIndex]['url']);
    nextObservable.subscribe((data) => {
      console.log(data);
    });
  }

  handlePrevious(value) : void {
    -- this.currentIndex;
  }

  getComponentAnalyses(item) {
    this.renderComponentService.getComponentAnalyses(item)
      .subscribe(
      componentAnalysesData => {
        ////debugger;
        this.componentAnalysesData = componentAnalysesData;
      },
      error => this.errorMessage = <any>error
      );
  }

  tdClicked(item) {
    alert('am in!!' + item);
    this.getComponentAnalyses(item);
  }

  // process recomendation form //
  processForm(row: any) {
    console.log(event);
    console.log(this.recomendationForm.value);
  }

}
