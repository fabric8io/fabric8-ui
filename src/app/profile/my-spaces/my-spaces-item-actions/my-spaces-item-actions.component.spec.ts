import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { LocalStorageService } from 'angular-2-local-storage';
import { Broadcaster, Notifications } from 'ngx-base';
import {
  Contexts,
  SpaceNamePipe,
  SpaceService
} from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';

import { MenusService } from '../../../layout/header/menus.service';
import { ContextService } from '../../../shared/context.service';
import { loggedInUser, profile } from '../../../shared/context.service.mock';
import { ContextsMock } from '../../../space/create/codebases/services/github.service.mock';
import { ProfileService } from '../../profile.service';
import { MySpacesItemActionsComponent } from './my-spaces-item-actions.component';

describe('My Spaces Item Actions Component', () => {
  let fixture;
  let mockRouter: any;
  let mockBroadcaster: any;
  let mockContexts: any;
  let mockLocalStorage: any;
  let mockMenu: any;
  let mockNotifications: any;
  let mockProfileService: any;
  let mockRoute: any;
  let mockSpaceNamePipe: any;
  let mockSpaceService: any;
  let mockUserService: any;

  let space: any;

  beforeEach(() => {
    mockContexts = jasmine.createSpy('Contexts');
    mockRouter = jasmine.createSpy('Router');
    mockBroadcaster = jasmine.createSpy('Broadcaster');
    mockMenu = jasmine.createSpyObj('MenusService', ['attach']);
    mockSpaceService = jasmine.createSpy('SpaceService');
    mockUserService = jasmine.createSpyObj('UserService', ['getUserByUserId']);
    mockUserService.getUserByUserId.and.returnValue(Observable.of(loggedInUser));
    mockUserService.loggedInUser = Observable.of(loggedInUser);
    mockNotifications = jasmine.createSpy('Notifications');
    mockRoute = jasmine.createSpy('ActivatedRoute');
    mockProfileService = jasmine.createSpy('ProfileService');
    mockProfileService.current = Observable.of(profile);
    mockSpaceNamePipe = jasmine.createSpy('SpaceNamePipe');
    mockLocalStorage = jasmine.createSpy('LocalStorageService');

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [MySpacesItemActionsComponent],
      providers: [
        ContextService,
        {
          provide: Contexts, useClass: ContextsMock
        },
        {
          provide: Router, useValue: mockRouter
        },
        {
          provide: Broadcaster, useValue: mockBroadcaster
        },
        {
          provide: MenusService, useValue: mockMenu
        },
        {
          provide: SpaceService, useValue: mockSpaceService
        },
        {
          provide: UserService, useValue: mockUserService
        },
        {
          provide: Notifications, useValue: mockNotifications
        },
        {
          provide: ActivatedRoute, useValue: mockRoute
        },
        {
          provide: ProfileService, useValue: mockProfileService
        },
        {
          provide: LocalStorageService, useValue: mockLocalStorage
        },
        {
          provide: SpaceNamePipe, useValue: mockSpaceNamePipe
        }
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });

    space = {
      attributes: {
        createdAt: '2017-12-07T21:25:59.811024Z',
        description: 'This is my space',
        name: 'test1',
        'updated-at': '2017-12-07T21:25:59.811024Z',
        version: 1
      },
      id: '3eeaa158-a68c-4ff3-9b0d-23ee3368d8b3',
      relationalData: {
        creator: {
          attributes: {
            bio: 'this is my bio',
            cluster: 'https://api.starter-us-east-2.openshift.com',
            company: 'Red Hat',
            contextInformation: {},
            'created-at': '2017-12-07T21:25:59.811024Z',
            email: 'last@redhat.com',
            fullName: 'First Last',
            itentityId: '3cbd262a-016d-4369-affe-eca01ac3',
            imageURL: 'https://www.gravatar.com/avatar/369e6a42fedbe342df8ec7f056162.jpg',
            providerType: 'kc',
            registrationCompleted: true,
            'updated-at': '2017-12-07T21:25:59.811024Z',
            url: '',
            userID: 'c21f2ece-21f0-4e7f-b9ab-b49b8dd0d752',
            username: 'name@redhat.com'
          },
          id: 'c21f2ece-21f0-4e7f-b9ab-b49b8dd0d752'
        }
      }
    };
    fixture = TestBed.createComponent(MySpacesItemActionsComponent);
  });

  it('Init component succesfully', async(() => {
    let comp = fixture.componentInstance;
    let debug = fixture.debugElement;
    comp.space = space;
    fixture.detectChanges();
    let element = debug.queryAll(By.css('.list-pf-actions'));
    fixture.whenStable().then(() => {
      expect(element.length).toEqual(1);
    });
  }));
});
