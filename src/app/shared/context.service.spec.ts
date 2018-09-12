import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { LocalStorageService } from 'angular-2-local-storage';
import { cloneDeep } from 'lodash';
import { Broadcaster, Notifications } from 'ngx-base';
import { SpaceService } from 'ngx-fabric8-wit';
import { FeatureTogglesService } from 'ngx-feature-flag';
import { UserService } from 'ngx-login-client';
import { of } from 'rxjs/observable/of';
import { MenusService } from '../layout/header/menus.service';
import { ProfileService } from '../profile/profile.service';
import { ContextService } from './context.service';
import { context1, context2, loggedInUser, profile, spaceMock } from './context.service.mock';
import { EventService } from './event.service';

describe('Context Service:', () => {
  let mockRouter: any;
  let mockBroadcaster: any;
  let mockMenu: any;
  let mockSpaceService: any;
  let mockUserService: any;
  let mockNotifications: any;
  let mockRoute: any;
  let mockProfileService: any;
  let mockLocalStorage: any;
  let mockFeatureTogglesService: any;
  let contextService: ContextService;

  beforeEach(() => {
    mockRouter = jasmine.createSpy('Router');
    mockBroadcaster = jasmine.createSpyObj('Broadcaster', ['broadcast']);
    mockMenu = jasmine.createSpyObj('MenusService', ['attach']);
    mockSpaceService = jasmine.createSpyObj('SpaceService', ['getSpaceByName']);
    mockSpaceService.getSpaceByName.and.returnValue(of(spaceMock));
    mockUserService = jasmine.createSpyObj('UserService', ['getUserByUserId']);
    mockUserService.getUserByUserId.and.returnValue(of(loggedInUser));
    mockUserService.loggedInUser = of(loggedInUser);
    mockNotifications = jasmine.createSpy('Notifications');
    mockRoute = jasmine.createSpy('ActivatedRoute');
    mockProfileService = jasmine.createSpy('ProfileService');
    mockProfileService.current = of(profile);
    mockLocalStorage = jasmine.createSpy('LocalStorageService');
    mockFeatureTogglesService = jasmine.createSpyObj('FeatureTogglesService', ['getAllFeaturesEnabledByLevel']);
    mockFeatureTogglesService.getAllFeaturesEnabledByLevel.and.returnValue(of([]));
    TestBed.configureTestingModule({
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
          provide: FeatureTogglesService, useValue: mockFeatureTogglesService
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

  it('Feature-flag - getFeatures return a list of features', (done: DoneFn) => {
    // given
    const features = [
      {
        id: 'Deployments',
        attributes: {
          enabled: true
        }
      },
      {
        id: 'Applications',
        attributes: {
          enabled: false
        }
      }];
    mockFeatureTogglesService.getAllFeaturesEnabledByLevel.and.returnValue(of(features));
    const navigation = of({
      space: 'TEST',
      url: '/user_name/TEST',
      user: 'user_name'
    });

    // when
    contextService.changeContext(navigation).subscribe(val => {});
    contextService.current.subscribe(val => {
      expect((val.user as any).features).toEqual(features);
      done();
    });
  });

  // FIXME
  xit('Feature-flag - getFeatures return an error', (done: DoneFn) => {
    // given
    mockFeatureTogglesService.getAllFeaturesEnabledByLevel.and.throwError({});
    const navigation = of({
      space: 'TEST',
      url: '/user_name/TEST',
      user: 'user_name'
    });

    // when
    contextService.changeContext(navigation).subscribe(() => {});
    contextService.current.subscribe(val => {
      expect((val.user as any).features).toBeNull();
      done();
    });
  });

  it('emits error when requested user contains reserved characters', (done: DoneFn) => {
    const navigation = of({
      space: 'TEST',
      url: '/_user/TEST',
      user: '_user'
    });
    contextService.changeContext(navigation).subscribe(
      () => done.fail('should have errored'),
      () => done()
    );
  });

  it('emits error when requested space contains reserved characters', (done: DoneFn) => {
    const navigation = of({
      space: '_TEST',
      url: '/user/_TEST',
      user: 'user'
    });
    contextService.changeContext(navigation).subscribe(
      () => done.fail('should have errored'),
      () => done()
    );
  });
});
