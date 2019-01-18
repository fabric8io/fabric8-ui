import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Broadcaster, Notifications } from 'ngx-base';
import { Context, Space, SpaceAttributes, SpaceService } from 'ngx-fabric8-wit';
import { Feature, FeatureTogglesService } from 'ngx-feature-flag';
import { User, UserService } from 'ngx-login-client';
import {
  ConnectableObservable,
  never as observableNever,
  Observable,
  of as observableOf,
  throwError as observableThrowError,
} from 'rxjs';
import { createMock } from 'testing/mock';
import { MenusService } from '../layout/header/menus.service';
import { Navigation } from '../models/navigation';
import { ExtProfile, ProfileService } from '../profile/profile.service';
import { ContextService } from './context.service';
import { context1, context2, loggedInUser, profile, spaceMock } from './context.service.mock';

describe('Context Service:', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContextService,
        {
          provide: Router,
          useFactory: (): jasmine.SpyObj<Router> => {
            const mockRouter: jasmine.SpyObj<Router> = jasmine.createSpyObj('Router', [
              'serializeUrl',
            ]);
            return mockRouter;
          },
        },
        {
          provide: Broadcaster,
          useFactory: (): jasmine.SpyObj<Broadcaster> => {
            const mockBroadcaster: jasmine.SpyObj<Broadcaster> = createMock(Broadcaster);
            mockBroadcaster.broadcast.and.callThrough();
            mockBroadcaster.on.and.callFake(
              (key: string): Observable<Context | Space> => {
                if (key === 'contextChanged') {
                  return observableNever();
                }
                if (key === 'spaceDeleted') {
                  return observableNever();
                }
              },
            );
            return mockBroadcaster;
          },
        },
        {
          provide: MenusService,
          useFactory: (): jasmine.SpyObj<MenusService> => {
            const mockMenuService: jasmine.SpyObj<MenusService> = jasmine.createSpyObj(
              'MenusService',
              ['attach'],
            );
            return mockMenuService;
          },
        },
        {
          provide: SpaceService,
          useFactory: (): jasmine.SpyObj<SpaceService> => {
            const mockSpaceService: jasmine.SpyObj<SpaceService> = createMock(SpaceService);
            mockSpaceService.getSpaceByName.and.returnValue(observableOf(spaceMock));
            mockSpaceService.getSpaceById.and.returnValue(observableOf(spaceMock));
            return mockSpaceService;
          },
        },
        {
          provide: UserService,
          useFactory: (): jasmine.SpyObj<UserService> => {
            const mockUserService: any = createMock(UserService);
            (loggedInUser as any).features = undefined;
            mockUserService.getUserByUserId.and.returnValue(observableOf(
              loggedInUser,
            ) as Observable<User>);
            mockUserService.loggedInUser = observableOf(loggedInUser) as ConnectableObservable<
              User
            > &
              jasmine.Spy;
            return mockUserService;
          },
        },
        {
          provide: Notifications,
          useFactory: (): jasmine.SpyObj<Notifications> => {
            const mockNotifications: jasmine.SpyObj<Notifications> = createMock(Notifications);
            return mockNotifications;
          },
        },
        {
          provide: ActivatedRoute,
          useFactory: (): jasmine.SpyObj<ActivatedRoute> => {
            const mockActivatedRoute: jasmine.SpyObj<ActivatedRoute> = createMock(ActivatedRoute);
            return mockActivatedRoute;
          },
        },
        {
          provide: ProfileService,
          useFactory: (): jasmine.SpyObj<ProfileService> => {
            const mockProfileService: any = jasmine.createSpyObj('ProfileService', ['silentSave']);
            mockProfileService.current = observableOf(profile);
            mockProfileService.silentSave.and.returnValue(observableOf(profile));
            return mockProfileService;
          },
        },
        {
          provide: FeatureTogglesService,
          useFactory: (): jasmine.SpyObj<FeatureTogglesService> => {
            const mockFeatureTogglesService: jasmine.SpyObj<FeatureTogglesService> = createMock(
              FeatureTogglesService,
            );
            mockFeatureTogglesService.getAllFeaturesEnabledByLevel.and.returnValue(
              observableNever(),
            );
            return mockFeatureTogglesService;
          },
        },
      ],
    });
  });

  it('URL change to a new space, recent space list get updated successfully', (done: DoneFn) => {
    // given
    const context3: Context = cloneDeep(context1);
    context3.name = 'space3';
    context3.path = '/ckrych@redhat.com/space3';
    context3.space = {} as Space;
    context3.space.id = '3';
    context3.space.name = 'space3';
    context3.space.path = '/ckrych@redhat.com/space3';
    context3.space.attributes = {} as SpaceAttributes;
    context3.space.attributes.name = 'space3';

    let recent: Context[] = [context1, context2];
    (profile as ExtProfile).store.recentContexts = recent;

    const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
    spaceService.getSpaceById.and.returnValues(
      observableOf(context1.space),
      observableOf(context2.space),
    );

    // when
    const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
    broadcaster.on.and.callFake(
      (key: string): Observable<Context> => {
        if (key === 'contextChanged') {
          return observableOf(context3);
        }
        if (key === 'spaceDeleted') {
          return observableNever();
        }
      },
    );
    const contextService: ContextService = TestBed.get(ContextService);

    // then
    contextService.recent.subscribe((recent: Context[]) => {
      expect(recent.length).toEqual(3);
      expect(recent[0].name).toEqual(context3.name);
      done();
    });
  });

  it('URL change to a new space (already in recent), recent space list get updated successfully', (done: DoneFn) => {
    // given
    let recent: Context[] = [context1, context2];
    (profile as ExtProfile).store.recentContexts = recent;

    const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
    spaceService.getSpaceById.and.returnValues(
      observableOf(context1.space),
      observableOf(context2.space),
    );

    // when
    const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
    broadcaster.on.and.callFake(
      (key: string): Observable<Context> => {
        if (key === 'contextChanged') {
          return observableOf(context2);
        }
        if (key === 'spaceDeleted') {
          return observableNever();
        }
      },
    );
    const contextService: ContextService = TestBed.get(ContextService);

    // then
    contextService.recent.subscribe((recent: Context[]) => {
      expect(recent.length).toEqual(2);
      expect(recent[0].name).toEqual(context2.name);
      done();
    });
  });

  it('Space - which belong to recent list - has been deleted, recent space list get updated removing it', () => {
    // given
    let recent: Context[] = [context1, context2];
    (profile as ExtProfile).store.recentContexts = recent;

    const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
    spaceService.getSpaceById.and.returnValues(
      observableOf(context1.space),
      observableOf(context2.space),
    );

    // when
    const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
    broadcaster.on.and.callFake(
      (key: string): Observable<Context | Space> => {
        if (key === 'contextChanged') {
          return observableNever();
        }
        if (key === 'spaceDeleted') {
          return observableOf(context2.space);
        }
      },
    );
    const contextService: ContextService = TestBed.get(ContextService);

    // then
    contextService.recent.subscribe((recent: Context[]) => {
      expect(recent.length).toEqual(1);
      expect(recent[0].name).toEqual(context1.name);
    });
  });

  it('Space - which does not belong to recent list - has been deleted, recent space list not changed', () => {
    // given
    const context3: Context = cloneDeep(context2);
    context3.name = 'space3';
    context3.path = '/ckrych@redhat.com/space3';
    context3.space = {} as Space;
    context3.space.id = '3';
    context3.space.name = 'space3';
    context3.space.path = '/ckrych@redhat.com/space3';
    context3.space.attributes = {} as SpaceAttributes;
    context3.space.attributes.name = 'space3';

    let recent: Context[] = [context1, context2];
    (profile as ExtProfile).store.recentContexts = recent;

    // when
    const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
    broadcaster.on.and.callFake(
      (key: string): Observable<Context | Space> => {
        if (key === 'contextChanged') {
          return observableNever();
        }
        if (key === 'spaceDeleted') {
          return observableOf(context3.space);
        }
      },
    );
    const contextService: ContextService = TestBed.get(ContextService);

    // then
    contextService.recent.subscribe((recent: Context[]) => {
      expect(recent.length).toEqual(2);
      expect(recent[0].name).toEqual(context1.name);
    });
  });

  it('Feature-flag - getFeatures return a list of features', (done: DoneFn) => {
    const mockFeatureTogglesService: jasmine.SpyObj<FeatureTogglesService> = TestBed.get(
      FeatureTogglesService,
    );

    // given
    const features: Feature[] = [
      {
        id: 'Deployments',
        attributes: {
          enabled: true,
        },
      },
      {
        id: 'Applications',
        attributes: {
          enabled: false,
        },
      },
    ] as Feature[];
    mockFeatureTogglesService.getAllFeaturesEnabledByLevel.and.returnValue(observableOf(features));
    const navigation: Observable<Navigation> = observableOf({
      space: 'TEST',
      url: '/user_name/TEST',
      user: 'user_name',
    });

    // when
    const contextService: ContextService = TestBed.get(ContextService);
    contextService.changeContext(navigation).subscribe(() => {});
    contextService.current.subscribe((val: Context) => {
      expect((val.user as any).features).toEqual(features);
      done();
    });
  });

  it('Feature-flag - getFeatures return an error', (done: DoneFn) => {
    const mockFeatureTogglesService: jasmine.SpyObj<FeatureTogglesService> = TestBed.get(
      FeatureTogglesService,
    );

    // given
    mockFeatureTogglesService.getAllFeaturesEnabledByLevel.and.returnValue(
      observableThrowError('error'),
    );
    const navigation: Observable<Navigation> = observableOf({
      space: 'TEST',
      url: '/user_name/TEST',
      user: 'user_name',
    });

    // when
    const contextService: ContextService = TestBed.get(ContextService);
    contextService.changeContext(navigation).subscribe(() => {});
    contextService.current.subscribe((val: Context) => {
      expect((val.user as any).features).toBeUndefined();
      done();
    });
  });

  it('emits error when requested user contains reserved characters', (done: DoneFn) => {
    const navigation: Observable<Navigation> = observableOf({
      space: 'TEST',
      url: '/_user/TEST',
      user: '_user',
    });

    const contextService: ContextService = TestBed.get(ContextService);
    contextService
      .changeContext(navigation)
      .subscribe(() => done.fail('should have errored'), () => done());
  });

  it('emits error when requested space contains reserved characters', (done: DoneFn) => {
    const navigation: Observable<Navigation> = observableOf({
      space: '_TEST',
      url: '/user/_TEST',
      user: 'user',
    });

    const contextService: ContextService = TestBed.get(ContextService);
    contextService
      .changeContext(navigation)
      .subscribe(() => done.fail('should have errored'), () => done());
  });

  describe('#loadRecent', () => {
    it("should return an empty array if recentContexts doesn't exist on profile.store", (done: DoneFn) => {
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      broadcaster.on.and.returnValue(observableNever());
      delete (profile as ExtProfile).store.recentContexts;
      const contextService: ContextService = TestBed.get(ContextService);
      let result: Observable<Context[]> = contextService.recent;
      result.subscribe(
        (r: Context[]): void => {
          expect(r).toEqual([] as Context[]);
          done();
        },
      );
    });

    it('should still return if spaceService.getSpaceById throws an error', (done: DoneFn) => {
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      broadcaster.on.and.returnValue(observableNever());

      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spaceService.getSpaceById.and.returnValue(observableThrowError('error'));
      (profile as ExtProfile).store.recentContexts = [context1];

      const contextService: ContextService = TestBed.get(ContextService);
      let result: Observable<Context[]> = contextService.recent;
      result.subscribe(
        (r: Context[]): void => {
          expect(r).toEqual([] as Context[]);
          done();
        },
      );
    });

    it('should still return if the recentSpaces on the profile is empty', (done: DoneFn) => {
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      broadcaster.on.and.returnValue(observableNever());
      (profile as ExtProfile).store.recentContexts = [];
      const contextService: ContextService = TestBed.get(ContextService);
      let result: Observable<Context[]> = contextService.recent;
      result.subscribe((r: Context[]) => {
        expect(r).toEqual([] as Context[]);
        done();
      });
    });
  });
});
