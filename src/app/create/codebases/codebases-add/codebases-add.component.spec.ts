import { CodebasesAddComponent } from './codebases-add.component';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Contexts } from 'ngx-fabric8-wit';
import { Broadcaster, Notifications } from 'ngx-base';
import { CodebasesService } from '../services/codebases.service';
import { GitHubService } from '../services/github.service';
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from '@angular/platform-browser';
import { Logger } from 'ngx-base';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { MockBackend } from '@angular/http/testing';
import { XHRBackend, HttpModule } from '@angular/http';
import { ContextsMock, expectedGitHubRepo, expectedGitHubRepoCommit, expectedGitHubRepoDetails, expectedGitHubRepoLicense } from '../services/github.service.mock';
import { Codebase } from '../services/codebase';
import { FormsModule, NgForm } from '@angular/forms';
import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

describe('Codebase Add Component', () => {

  let broadcasterMock: any;
  let codebasesServiceMock: any;
  let contextsMock: any;
  let gitHubServiceMock: any;
  let notificationMock: any;
  let routerMock: any;
  let routeMock: any;
  let authServiceMock: any;
  let userServiceMock: any;
  let fixture, codebases, codebase;

  beforeEach(() => {
    broadcasterMock = jasmine.createSpyObj('Broadcaster', ['broadcast']);
    codebasesServiceMock = jasmine.createSpyObj('CodebasesService', ['getCodebases', 'addCodebase']);
    authServiceMock = jasmine.createSpy('AuthenticationService');
    contextsMock = jasmine.createSpy('Contexts');
    gitHubServiceMock = jasmine.createSpyObj('GitHubService', ['getRepoDetailsByFullName', 'getRepoLicenseByUrl']);
    notificationMock = jasmine.createSpyObj('Notifications', ['message']);
    routerMock = jasmine.createSpy('Router');
    routeMock = jasmine.createSpy('ActivatedRoute');
    userServiceMock = jasmine.createSpy('UserService');

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [CodebasesAddComponent],
      providers: [
        {
          provide: Broadcaster, useValue: broadcasterMock
        },
        {
          provide: CodebasesService, useValue: codebasesServiceMock
        },
        {
          provide: Contexts, useClass: ContextsMock
        },
        {
          provide: GitHubService, useValue: gitHubServiceMock
        },
        {
          provide: Notifications, useValue: notificationMock
        },
        {
          provide: Router, useValue: routerMock
        },
        {
          provide: ActivatedRoute, useValue: routeMock
        }
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    codebase = {
      "attributes": {
        "type": "git",
        "url": "https://github.com/fabric8io/fabric8-ui.git"
      },
      "type": "codebases"
    } as Codebase;
    codebases = [codebase];
    codebasesServiceMock.getCodebases.and.returnValue(Observable.of(codebases));
    fixture = TestBed.createComponent(CodebasesAddComponent);
  });

  it('Init component succesfully', async(() => {
    // given
    let comp = fixture.componentInstance;
    let debug = fixture.debugElement;
    let inputGitHubRepo = debug.query(By.css('#gitHubRepo'));
    inputGitHubRepo.nativeElement.value = 'start'
    inputGitHubRepo.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(comp.codebases).toEqual(codebases)
    });
  }));

  it('Display gihub repo details after sync button pressed', async(() => {
    // given
    gitHubServiceMock.getRepoDetailsByFullName.and.returnValue(Observable.of(expectedGitHubRepoDetails));
    gitHubServiceMock.getRepoLicenseByUrl.and.returnValue(Observable.of(expectedGitHubRepoLicense));
    let comp = fixture.componentInstance;
    let debug = fixture.debugElement;
    let inputSpace = debug.query(By.css('#spacePath'));
    let inputGitHubRepo = debug.query(By.css('#gitHubRepo'));
    const syncButton = debug.query(By.css('#syncButton'));
    const form = debug.query(By.css('form'));
    inputGitHubRepo.nativeElement.value = 'start'
    inputGitHubRepo.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      // when github repos added and sync button cliked
      inputGitHubRepo.nativeElement.value = 'TestSpace/toto';
      inputGitHubRepo.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        syncButton.nativeElement.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          // then
          expect(form.nativeElement.querySelector('#created').value).toEqual('Mar 19, 2016, 11:42:15 AM');
        });
      });
    });
  }));

  it('Display error after sync button pressed with invalid gitname', async(() => {
    // given
    gitHubServiceMock.getRepoDetailsByFullName.and.returnValue(Observable.of(expectedGitHubRepoDetails));
    gitHubServiceMock.getRepoLicenseByUrl.and.returnValue(Observable.of(expectedGitHubRepoLicense));
    let comp = fixture.componentInstance;
    let debug = fixture.debugElement;
    let inputSpace = debug.query(By.css('#spacePath'));
    let inputGitHubRepo = debug.query(By.css('#gitHubRepo'));
    const syncButton = debug.query(By.css('#syncButton'));
    const form = debug.query(By.css('form'));
    inputGitHubRepo.nativeElement.value = 'start'
    inputGitHubRepo.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      // when github repos added and sync button cliked
      inputGitHubRepo.nativeElement.value = 'TestSpace::toto';
      inputGitHubRepo.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        syncButton.nativeElement.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          // then
          let errorSpan = fixture.debugElement.query(By.css('.help-block'));
          expect(errorSpan).toBeTruthy();
        });
      });
    });
  }));

  it('Add codebase to space', async(() => {
    // given
    gitHubServiceMock.getRepoDetailsByFullName.and.returnValue(Observable.of(expectedGitHubRepoDetails));
    gitHubServiceMock.getRepoLicenseByUrl.and.returnValue(Observable.of(expectedGitHubRepoLicense));
    codebasesServiceMock.addCodebase.and.returnValue(Observable.of(codebase));
    const notificationAction = {
      id: "a",
      isDisabled: false,
      isSeparator: false,
      name: "created",
      title: "coode base created"
    };
    notificationMock.message.and.returnValue(Observable.of(notificationAction));
    let comp = fixture.componentInstance;
    let debug = fixture.debugElement;
    let inputSpace = debug.query(By.css('#spacePath'));
    let inputGitHubRepo = debug.query(By.css('#gitHubRepo'));
    const syncButton = debug.query(By.css('#syncButton'));
    const form = debug.query(By.css('form'));
    inputGitHubRepo.nativeElement.value = 'start'
    inputGitHubRepo.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      // when github repos added and sync button cliked
      inputGitHubRepo.nativeElement.value = 'TestSpace/toto';
      inputGitHubRepo.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        syncButton.nativeElement.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          let addButton = fixture.debugElement.query(By.css('#associateButton'));
          addButton.nativeElement.click();
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            // then
            expect(notificationMock.message).toHaveBeenCalled();
            //expect().toBeTruthy();
          });
        });
      });
    });
  }));
});



