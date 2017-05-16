import { CodebasesItemComponent } from './codebases-item.component';
import { Observable } from 'rxjs';
import { Contexts } from 'ngx-fabric8-wit';
import { Notifications, NotificationType } from 'ngx-base';
import { CodebasesService } from '../services/codebases.service';
import { GitHubService } from '../services/github.service';
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { expectedGitHubRepoDetails } from '../services/github.service.mock';
import { Codebase } from '../services/codebase';
import { FormsModule, NgForm } from '@angular/forms';
import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { cloneDeep } from 'lodash';

describe('Codebases Item Component', () => {
  let gitHubServiceMock: any;
  let notificationMock: any;
  let fixture, codebases, codebase;

  beforeEach(() => {
    gitHubServiceMock = jasmine.createSpyObj('GitHubService', ['getRepoDetailsByUrl']);
    notificationMock = jasmine.createSpyObj('Notifications', ['message']);

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [CodebasesItemComponent],
      providers: [
        {
          provide: GitHubService, useValue: gitHubServiceMock
        },
        {
          provide: Notifications, useValue: notificationMock
        }
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    codebase = {
      "attributes": {
        "createdAt": "2017-04-28T09:28:22.224442Z",
        "last_used_workspace": "",
        "stackId": "",
        "type": "git",
        "url": "https://github.com/almighty/almighty-core.git"
      },
      "id": "6f5b6738-170e-490e-b3bb-d10f56b587c8",
      "links": {
        "edit": "https://api.prod-preview.openshift.io/api/codebases/6f5b6738-170e-490e-b3bb-d10f56b587c8/edit",
        "self": "https://api.prod-preview.openshift.io/api/codebases/6f5b6738-170e-490e-b3bb-d10f56b587c8"
      },
      "relationships": {
        "space": {
          "data": {
            "id": "1d7af8bf-0346-432d-9096-4e2b59d2db87",
            "type": "spaces"
          },
          "links": {
            "self": "https://api.prod-preview.openshift.io/api/spaces/1d7af8bf-0346-432d-9096-4e2b59d2db87"
          }
        }
      },
      "type": "codebases",
      "name": "https://github.com/almighty/almighty-core",
      "url": "https///github.com/almighty/almighty-core"
    };
    gitHubServiceMock.getRepoDetailsByUrl.and.returnValue(Observable.of(expectedGitHubRepoDetails));
    fixture = TestBed.createComponent(CodebasesItemComponent);
  });

  it('Init component succesfully', async(() => {
    // given
    let comp = fixture.componentInstance;
    let debug = fixture.debugElement;
    comp.codebase = codebase;
    fixture.detectChanges();
    let spanDisplyedInformation = debug.queryAll(By.css('.list-group-item-text'));
    fixture.whenStable().then(() => {
      expect(spanDisplyedInformation.length).toEqual(3)
    });
  }));

  it('Init component in error', async(() => {
    // given
    let comp = fixture.componentInstance;
    let debug = fixture.debugElement;
    comp.codebase = cloneDeep(codebase);
    comp.codebase.attributes.url = 'bo:o';
    const errorNotif = {
      message: "An Error",
      type: NotificationType.DANGER
    };
    notificationMock.message.and.returnValue(Observable.of(errorNotif));
    fixture.detectChanges();
    let spanParent = debug.query(By.css('.list-group-item-heading'));
    let spanError = spanParent.query(By.css('span:last-child'));
    fixture.whenStable().then(() => {
      expect(spanError.nativeElement.textContent).toEqual("Invalid URL");
      expect(notificationMock.message).toHaveBeenCalled();
    });
  }));
});
