import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewEncapsulation,
  ElementRef
} from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { TypeaheadMatch } from 'ngx-bootstrap';

import { IModalHost } from '../../../wizard/models/modal-host';
import { GitHubRepoBranch, GitHubRepoDetails } from '../../codebases/services/github';
import { GitHubService } from '../../codebases/services/github.service';
import { WorkspacesService } from '../../codebases/services/workspaces.service';

interface IRepositoryOption {
  codebaseId: string;
  fullName: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'create-workspaces-dialog',
  templateUrl: './create-workspaces-dialog.component.html',
  styleUrls: ['./create-workspaces-dialog.component.less']
})
export class CreateWorkspacesDialogComponent implements OnInit, OnDestroy {

  @Input() reposMap: Map<string, GitHubRepoDetails>;
  @Output('onCreated') onCreated = new EventEmitter();
  @ViewChild('createWorkspaceModal') createWorkspaceModal: IModalHost;
  @ViewChild('typeahead') typeahead: any;
  @ViewChild('emptyOption') emptyOption: ElementRef;
  @ViewChild('branchNameModel') branchNameModel: NgModel;

  repoOptions: IRepositoryOption[] = [];
  workspaceName: string;
  codebaseId: string;
  branchName: string;
  repoFullName: string;
  branchesList: GitHubRepoBranch[];
  branchesSource: Observable<GitHubRepoBranch[]>;

  constructor(
    private gitHubService: GitHubService,
    private workspacesService: WorkspacesService
  ) { }

  ngOnInit() {
    this.branchesSource = Observable.of([]);
  }

  ngOnDestroy() { }

  cancel() {
    this.createWorkspaceModal.close();
  }

  open(): void {
    this.createWorkspaceModal.open();
  }

  changeRepo($event: any): void {
    if (!this.codebaseId) {
      return;
    }

    this.disableEmptyOption();

    const fullName = this.reposMap.get(this.codebaseId).full_name;
    this.repoFullName = fullName;

    // update list of branches
    this.gitHubService.getRepoBranchesByFullName(fullName).subscribe(branchesList => {
      this.branchesList = branchesList;

      this.branchesSource = Observable.create(observer => {
        // runs on every search
        observer.next(this.branchName);
      }).mergeMap(token => this.getBranchesAsObservable(token));
    });
  }

  getRepos(): IRepositoryOption[] {
    this.repoOptions.length = 0;

    if (!this.reposMap || this.reposMap.size === 0) {
      return this.repoOptions;
    }

    this.reposMap.forEach((repo: GitHubRepoDetails, codebaseId: string) => {
      this.repoOptions.push({
        codebaseId: codebaseId,
        fullName: repo.full_name
      });
    });

    this.repoOptions.sort((a: IRepositoryOption, b: IRepositoryOption) => {
      return a.fullName === b.fullName ? 0 :
        a.fullName > b.fullName ? 1 : -1;
    });

    return this.repoOptions;
  }

  createWorkspace(form: NgForm): void {
    if (form.invalid) {
      for (let controlName in form.controls) {
        if (form.controls.hasOwnProperty(controlName)) {
          form.controls[controlName].markAsDirty();
        }
      }
      console.warn('Some necessary data are missed.');
      return;
    }

    this.onCreated.emit();
  }

  changeTypeaheadLoading(e: boolean): void {
    const error = e === true
      ? {branchesLoading: true}
      : null;
    this.branchNameModel.control.setErrors(error);
  }

  changeTypeaheadNoResults(e: boolean): void {
    const error = e === true
      ? {branchNotFound: true}
      : null;
    this.branchNameModel.control.setErrors(error);
  }

  typeaheadOnSelect(e: TypeaheadMatch): void { }

  private getBranchesAsObservable(token: string): Observable<GitHubRepoBranch[]> {
    const query = new RegExp(token, 'i');
    return Observable.of(
      this.branchesList.filter((branch: GitHubRepoBranch) => {
        return query.test(branch.name);
      })
    );
  }

  private disableEmptyOption(): void {
    this.emptyOption.nativeElement.disabled = true;
  }

}
