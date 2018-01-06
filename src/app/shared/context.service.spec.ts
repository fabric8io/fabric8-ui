import { TestBed } from '@angular/core/testing';
import { Http, Response, ResponseOptions, XHRBackend, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AuthenticationService, AUTH_API_URL } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { ContextService } from './context.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Broadcaster, Notifications, Notification, NotificationType } from 'ngx-base';
import { User, UserService, Entity } from 'ngx-login-client';
import { MenusService } from '../layout/header/menus.service';
import {
  Space,
  Context,
  Contexts,
  ContextTypes,
  SpaceService,
  SpaceNamePipe
} from 'ngx-fabric8-wit';
import { ProfileService } from './../profile/profile.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { EventService } from './event.service';
import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';
import { loggedInUser, profile, context1, context2 } from './context.service.mock';

describe('Context Service:', () => {
  let mockRouter: any;
  let mockBroadcaster: any;
  let mockMenu: any;
  let mockSpaceService: any;
  let mockUserService: any;
  let mockNotifications: any;
  let mockRoute: any;
  let mockProfileService: any;
  let mockSpaceNamePipe: any;
  let mockLocalStorage: any;
  let contextService: ContextService;


  beforeEach(() => {
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
      imports: [HttpModule],
      providers: [
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
        },
        EventService,
        ContextService
      ]
    });
    contextService = TestBed.get(ContextService);
  });

  it('URL change to a new space, recent space list get updated successfully', () => {
    // given
    const context3 = cloneDeep(context1);
    context3.name = 'space3';
    context3.path =  '/ckrych@redhat.com/space3';
    context3.space.id = '3';
    context3.space.name = 'space3';
    context3.space.path =  '/ckrych@redhat.com/space3';

    let recent = [context1, context2];
    // when
    recent = contextService.updateRecentSpaceList(recent, context3);

    // then
    expect(recent.length).toEqual(3);
    expect(recent[0]).toEqual(context3);
  });

  it('URL change to a new space - already in recent -, recent space list get updated successfully', () => {
    // given
    const context3 = cloneDeep(context2);
    let recent = [context1, context2];
    // when
    recent = contextService.updateRecentSpaceList(recent, context3);

    // then
    expect(recent.length).toEqual(2);
    expect(recent[0]).toEqual(context2);
  });

  it('Space - which belong to recent list - has been deleted, recent space list get updated removing it', () => {
    // given
    const context3 = cloneDeep(context2);
    context3.name = 'TO_DELETE';

    let recent = [context1, context2];
    // when
    recent = contextService.updateRecentSpaceList(recent, context3);

    // then
    expect(recent.length).toEqual(1);
    expect(recent[0]).toEqual(context1);
  });

  it('Space - which does not belong to recent list - has been deleted, recent space list not changed', () => {
    // given
    const context3 = cloneDeep(context2);
    context3.space.id = '3';
    context3.name = 'TO_DELETE';

    let recent = [context1, context2];
    // when
    recent = contextService.updateRecentSpaceList(recent, context3);

    // then
    expect(recent.length).toEqual(2);
    expect(recent[0]).toEqual(context1);
  });


});
