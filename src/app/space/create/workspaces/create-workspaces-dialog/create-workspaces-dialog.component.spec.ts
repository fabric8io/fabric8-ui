import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  Component,
  DebugElement,
  ViewChild
} from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { TypeaheadModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-modal';

import { GitHubRepo, GitHubRepoBranch, GitHubRepoDetails } from '../../codebases/services/github';
import { GitHubService } from '../../codebases/services/github.service';
import { WorkspacesService } from '../../codebases/services/workspaces.service';

import { CreateWorkspacesDialogComponent } from './create-workspaces-dialog.component';
import { Observable } from 'rxjs/Observable';

/* Testing within a host component */

@Component({
  template: `<create-workspaces-dialog #createWorkspacesDialog
                                       [reposMap]="reposByCodebase"
                                       (onCreated)="createWorkspace($event)"></create-workspaces-dialog>`
})
class TestHostComponent {
  @ViewChild('createWorkspacesDialog') createWorkspacesDialog: CreateWorkspacesDialogComponent;

  reposByCodebase: Map<string, GitHubRepoDetails> = new Map();

  constructor() {
    this.reposByCodebase.set(this.testCodebaseId, this.testRepoDetails);
  }

  createWorkspace(): void { }

  get testCodebaseId(): string {
    return '3d8cf4f6-60ce-4053-880d-efde0b39034a';
  }

  get testRepoDetails(): GitHubRepoDetails {
    return {
      'id': 53583373,
      'name': 'che',
      'full_name': 'akurinnoy/che',
      'created_at': '2016-03-10T12:39:11Z',
      'updated_at': '2016-03-10T12:39:26Z',
      'git_url': 'git://github.com/akurinnoy/che.git',
      'default_branch': 'master',
      'parent': {
        'id': 32935745,
        'name': 'che',
        'full_name': 'eclipse/che',
        'url': 'https://api.github.com/repos/eclipse/che',
        'created_at': '2015-03-26T15:31:01Z',
        'updated_at': '2017-12-12T15:15:04Z',
        'git_url': 'git://github.com/eclipse/che.git'
      } as GitHubRepo
    } as GitHubRepoDetails;
  }
}

describe(`CreateWorkspacesDialogComponent`, () => {

  let fixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;
  let createWorkspacesDialogComponent: CreateWorkspacesDialogComponent;
  let createWorkspacesDialogElement: DebugElement;

  const gitHubServiceStub = {
    getRepoBranchesByFullName: (fullName: string): Observable<GitHubRepoBranch[]> => {
      return Observable.of([{
        name: 'master',
        commit: {
          sha: '8ab7e55fe8c8faea8f1e8ac8f0df7bf195a9fc26',
          url: 'https://api.github.com/repos/akurinnoy/che/commits/8ab7e55fe8c8faea8f1e8ac8f0df7bf195a9fc26'
        }
      }, {
        name: 'che6',
        commit: {
          sha: 'e63e4ab17a31de8bf8299a5db950ec0ca11894a4',
          url: 'https://api.github.com/repos/akurinnoy/che/commits/e63e4ab17a31de8bf8299a5db950ec0ca11894a4'
        }
      }] as GitHubRepoBranch[]);
    }
  };
  const workspacesServiceStub = null;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ModalModule,
        TypeaheadModule.forRoot()
      ],
      declarations: [
        TestHostComponent,
        CreateWorkspacesDialogComponent
      ],
      providers: [
        { provide: GitHubService, useValue: gitHubServiceStub },
        { provide: WorkspacesService, useValue: workspacesServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = fixture.componentInstance;
    createWorkspacesDialogComponent = testHostComponent.createWorkspacesDialog;

    fixture.detectChanges();

    createWorkspacesDialogElement = fixture.debugElement.query(By.css('form'));
  });

  it(`should compile create-workspaces-dialog component`, () => {
    expect(createWorkspacesDialogElement).toBeTruthy();
  });

  describe(`initial state of modal`, () => {

    let createWorkspaceModalElement: DebugElement;

    beforeEach(() => {
      createWorkspaceModalElement = createWorkspacesDialogElement.query(By.css('.create-workspace-dialog'));
    });

    it(`should be hidden`, () => {
      expect(createWorkspaceModalElement).toBeFalsy();
    });

  });

  describe(`when modal is open`, () => {

    let createWorkspaceModalElement: DebugElement;

    let branchNameElement: DebugElement;
    let createButtonElement: DebugElement;

    beforeEach(async(() => {
      testHostComponent.createWorkspacesDialog.open();
      fixture.detectChanges();
    }));

    beforeEach(() => {
      fixture.detectChanges();

      createWorkspaceModalElement = createWorkspacesDialogElement.query(By.css('.create-workspaces-dialog'));

      branchNameElement = createWorkspacesDialogElement.query(By.css('#branchName'));
      createButtonElement = createWorkspacesDialogElement.query(By.css('button[type="submit"]'));
    });

    it(`should make modal window visible`, () => {
      expect(createWorkspaceModalElement).toBeTruthy();
    });

    it(`should have 'Branch Name' disabled`, () => {
      expect(branchNameElement.attributes.disabled).toBeTruthy();
    });

    it(`should have 'Create' button disabled`, () => {
      expect(createButtonElement.attributes.disabled).toBeTruthy();
    });

    describe(`and when 'Codebase' is selected`, () => {

      beforeEach(async(() => {
        createWorkspacesDialogComponent.codebaseId = testHostComponent.testCodebaseId;
        fixture.detectChanges();
      }));

      it(`should have 'Branch Name' enabled`, () => {
        fixture.detectChanges();
        expect(branchNameElement.attributes.disabled).toBeFalsy();
      });

    });

    describe(`and when 'Workspace Name', 'Codebase' and 'Branch Name' are set`, () => {

      beforeEach(async(() => {
        createWorkspacesDialogComponent.workspaceName = 'test-workspace-name';
        createWorkspacesDialogComponent.codebaseId = testHostComponent.testCodebaseId;
        createWorkspacesDialogComponent.branchName = 'master';
        fixture.detectChanges();
      }));

      it(`should have 'Create' button enabled`, () => {
        fixture.detectChanges();
        expect(createButtonElement.attributes.disabled).toBeFalsy();

      });

      // todo
      xit(`should raise 'onCreated' event on 'Create' button clicked`, () => {
        const spy = spyOn(testHostComponent, 'createWorkspace');

        createButtonElement.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(spy.calls.any()).toBe(true, 'testHostComponent.createWorkspace is called');
      });

    });

  });

});

/* Testing stand-alone component */
// todo
