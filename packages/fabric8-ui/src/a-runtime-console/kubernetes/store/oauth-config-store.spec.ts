import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ErrorHandler } from '@angular/core';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import { User, UserService } from 'ngx-login-client';
import {
  BehaviorSubject,
  ConnectableObservable,
  Observable,
  ReplaySubject,
  Subscription,
  throwError as observableThrowError,
  VirtualAction,
  VirtualTimeScheduler,
} from 'rxjs';
import { multicast } from 'rxjs/operators';
import { createMock } from 'testing/mock';
import { NotificationsService } from '../../../app/shared/notifications.service';
import { OAuthConfig, OAuthConfigStore } from './oauth-config-store';

describe('OauthConfigStore', () => {
  let mockUserService: UserService;
  let controller: HttpTestingController;
  let oauthStore: OAuthConfigStore;

  let mockLogger: jasmine.SpyObj<Logger>;
  let mockErrorHandler: jasmine.SpyObj<ErrorHandler>;
  let mockNotificationsService: jasmine.SpyObj<NotificationsService>;

  let user: User = {
    attributes: {
      fullName: 'mock',
      imageURL: 'mock',
      username: 'mock',
      cluster: 'http://api.example.com/cluster/',
    },
    id: 'mock',
    type: 'mock',
  };

  let data = {};

  let subscriptions: Subscription[] = [];

  beforeEach(() => {
    mockLogger = jasmine.createSpyObj<Logger>('Logger', ['error']);
    mockErrorHandler = jasmine.createSpyObj<ErrorHandler>('ErrorHandler', ['handleError']);
    mockNotificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', [
      'message',
    ]);
  });

  afterEach(() => {
    subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  });

  describe('success state', () => {
    beforeEach(() => {
      mockUserService = createMock(UserService);
      mockUserService.loggedInUser = new BehaviorSubject(user).pipe<User>(
        multicast(() => new ReplaySubject(1)),
      ) as ConnectableObservable<User>;

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          {
            provide: UserService,
            useClass: mockUserService,
          },
          {
            provide: Logger,
            useValue: mockLogger,
          },
          {
            provide: ErrorHandler,
            useValue: mockErrorHandler,
          },
          {
            provide: NotificationsService,
            useValue: mockNotificationsService,
          },
          {
            // provide OAuthConfigStore with a factory inside the fakeAsync zone
            // so the mockBackend can catch http requests made inside the constructor
            provide: OAuthConfigStore,
            useFactory: (
              http: HttpClient,
              logger: Logger,
              errorHandler: ErrorHandler,
              notifications: NotificationsService,
            ) => {
              return new OAuthConfigStore(
                http,
                mockUserService,
                logger,
                errorHandler,
                notifications,
              );
            },
            deps: [HttpClient, HttpTestingController, Logger, ErrorHandler, NotificationsService],
          },
        ],
      });

      controller = TestBed.get(HttpTestingController);
      oauthStore = TestBed.get(OAuthConfigStore);
    });

    it('should load and set oauthconfig with openshift console on init', (done: DoneFn) => {
      mockUserService.loggedInUser.connect();
      subscriptions.push(
        oauthStore.loading.subscribe((val: boolean) => {
          if (!val) {
            subscriptions.push(
              oauthStore.resource.subscribe((config: OAuthConfig) => {
                expect(config.loaded).toBeTruthy();
                expect(config.openshiftConsoleUrl).toEqual(
                  'http://console.example.com/cluster/console',
                );

                expect(mockLogger.error).not.toHaveBeenCalled();
                expect(mockErrorHandler.handleError).not.toHaveBeenCalled();
                expect(mockNotificationsService.message).not.toHaveBeenCalled();
                done();
              }),
            );
          }
        }),
      );

      const req = controller.expectOne('/_config/oauth.json');
      expect(req.request.method).toBe('GET');
      req.flush(data);
    });
  });

  describe('user service empty', () => {
    beforeEach(() => {
      mockUserService = createMock(UserService);
      mockUserService.loggedInUser = new BehaviorSubject({} as User).pipe<User>(
        multicast(() => new ReplaySubject(1)),
      ) as ConnectableObservable<User>;

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          {
            provide: UserService,
            useClass: mockUserService,
          },
          {
            provide: Logger,
            useValue: mockLogger,
          },
          {
            provide: ErrorHandler,
            useValue: mockErrorHandler,
          },
          {
            provide: NotificationsService,
            useValue: mockNotificationsService,
          },
          {
            // provide OAuthConfigStore with a factory inside the fakeAsync zone
            // so the mockBackend can catch http requests made inside the constructor
            provide: OAuthConfigStore,
            useFactory: (
              http: HttpClient,
              logger: Logger,
              errorHandler: ErrorHandler,
              notifications: NotificationsService,
            ) => {
              return new OAuthConfigStore(
                http,
                mockUserService,
                logger,
                errorHandler,
                notifications,
              );
            },
            deps: [HttpClient, HttpTestingController, Logger, ErrorHandler, NotificationsService],
          },
        ],
      });

      controller = TestBed.get(HttpTestingController);
      oauthStore = TestBed.get(OAuthConfigStore);
    });

    it('should continue', (done: DoneFn) => {
      const req = controller.expectOne('/_config/oauth.json');
      expect(req.request.method).toBe('GET');
      req.flush(data);

      mockUserService.loggedInUser.connect();
      subscriptions.push(
        oauthStore.loading.subscribe((val: boolean) => {
          if (!val) {
            subscriptions.push(
              oauthStore.resource.subscribe((config: OAuthConfig) => {
                controller.verify();
                expect(config.loaded).toBeTruthy();
                expect(config.openshiftConsoleUrl).toBeUndefined();

                expect(mockLogger.error).not.toHaveBeenCalled();
                expect(mockErrorHandler.handleError).not.toHaveBeenCalled();
                expect(mockNotificationsService.message).not.toHaveBeenCalled();
                done();
              }),
            );
          }
        }),
      );
    });
  });

  describe('user service error', () => {
    let scheduler;
    beforeEach(() => {
      scheduler = new VirtualTimeScheduler(VirtualAction);

      mockUserService = createMock(UserService);
      mockUserService.loggedInUser = observableThrowError({ error: 'error' }, scheduler).pipe<User>(
        multicast(() => new ReplaySubject(1)),
      ) as ConnectableObservable<User>;

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          {
            provide: UserService,
            useClass: mockUserService,
          },
          {
            provide: Logger,
            useValue: mockLogger,
          },
          {
            provide: ErrorHandler,
            useValue: mockErrorHandler,
          },
          {
            provide: NotificationsService,
            useValue: mockNotificationsService,
          },
          {
            // provide OAuthConfigStore with a factory inside the fakeAsync zone
            // so the mockBackend can catch http requests made inside the constructor
            provide: OAuthConfigStore,
            useFactory: (http: HttpClient) => {
              return new OAuthConfigStore(
                http,
                mockUserService,
                mockLogger,
                mockErrorHandler,
                mockNotificationsService,
              );
            },
            deps: [HttpClient],
          },
        ],
      });

      controller = TestBed.get(HttpTestingController);
      oauthStore = TestBed.get(OAuthConfigStore);
    });

    it('should notify on user service error', (done: DoneFn) => {
      mockUserService.loggedInUser.connect();

      const req = controller.expectOne('/_config/oauth.json');
      expect(req.request.method).toBe('GET');
      req.flush(data);
      scheduler.flush();

      subscriptions.push(
        oauthStore.loading.subscribe((val: boolean) => {
          controller.verify();
          expect(val).toBeFalsy();
          expect(mockLogger.error).toHaveBeenCalled();
          expect(mockErrorHandler.handleError).toHaveBeenCalled();
          expect(mockNotificationsService.message).toHaveBeenCalled();
          done();
        }),
      );
    });
  });

  describe('config request error', () => {
    beforeEach(() => {
      mockUserService = createMock(UserService);
      mockUserService.loggedInUser = new BehaviorSubject(user).pipe<User>(
        multicast(() => new ReplaySubject(1)),
      ) as ConnectableObservable<User>;

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          {
            provide: UserService,
            useClass: mockUserService,
          },
          {
            provide: Logger,
            useValue: mockLogger,
          },
          {
            provide: ErrorHandler,
            useValue: mockErrorHandler,
          },
          {
            provide: NotificationsService,
            useValue: mockNotificationsService,
          },
          {
            // provide OAuthConfigStore with a factory inside the fakeAsync zone
            // so the mockBackend can catch http requests made inside the constructor
            provide: OAuthConfigStore,
            useFactory: (http: HttpClient) => {
              return new OAuthConfigStore(
                http,
                mockUserService,
                mockLogger,
                mockErrorHandler,
                mockNotificationsService,
              );
            },
            deps: [HttpClient],
          },
        ],
      });

      controller = TestBed.get(HttpTestingController);
      oauthStore = TestBed.get(OAuthConfigStore);
    });

    it('should notify on config http error', (done: DoneFn) => {
      mockUserService.loggedInUser.connect();

      const req = controller.expectOne('/_config/oauth.json');
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent(''));

      subscriptions.push(
        oauthStore.loading.subscribe((val: boolean) => {
          if (!val) {
            controller.verify();
            expect(mockLogger.error).toHaveBeenCalled();
            expect(mockErrorHandler.handleError).toHaveBeenCalled();
            expect(mockNotificationsService.message).toHaveBeenCalled();
            done();
          }
        }),
      );
    });
  });
});
