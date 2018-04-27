import { ErrorHandler } from '@angular/core';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';

import {
  Http,
  HttpModule,
  Response,
  ResponseOptions,
  ResponseType,
  XHRBackend
} from '@angular/http';

import {
  MockBackend,
  MockConnection
} from '@angular/http/testing';

import {
  Observable,
  Subscription
} from 'rxjs';


import { createMock } from 'testing/mock';

import {
  Logger
} from 'ngx-base';
import {
  User,
  UserService
} from 'ngx-login-client';

import {
  OAuthConfig,
  OAuthConfigStore
} from './oauth-config-store';

import { NotificationsService } from 'app/shared/notifications.service';

describe('OauthConfigStore', () => {

  let mockUserService: UserService;
  let mockBackend: MockBackend;
  let oauthStore: OAuthConfigStore;

  let mockLogger: jasmine.SpyObj<Logger>;
  let mockErrorHandler: jasmine.SpyObj<ErrorHandler>;
  let mockNotificationsService: jasmine.SpyObj<NotificationsService>;

  let user: User = {
    attributes: {
      fullName: 'mock',
      imageURL: 'mock',
      username: 'mock',
      cluster: 'http://api.example.com/cluster/'
    },
    id: 'mock',
    type: 'mock'
  };

  let data = {};

  let subscriptions: Subscription[] = [];

  beforeEach(() => {
    mockLogger = jasmine.createSpyObj<Logger>('Logger', ['error']);
    mockErrorHandler = jasmine.createSpyObj<ErrorHandler>('ErrorHandler', ['handleError']);
    mockNotificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']);
  });

  afterEach(() => {
    subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  });

  describe('success state', () => {
    beforeEach(() => {
      mockUserService = createMock(UserService);
      mockUserService.loggedInUser = Observable.of(user).publish();

      TestBed.configureTestingModule({
        imports: [HttpModule],
        providers: [
          {
            provide: XHRBackend, useClass: MockBackend
          },
          {
            provide: UserService, useClass: mockUserService
          },
          {
            provide: Logger, useValue: mockLogger
          },
          {
            provide: ErrorHandler, useValue: mockErrorHandler
          },
          {
            provide: NotificationsService, useValue: mockNotificationsService
          },
          {
            // provide OAuthConfigStore with a factory inside the fakeAsync zone
            // so the mockBackend can catch http requests made inside the constructor
            provide: OAuthConfigStore, useFactory: fakeAsync((
              http: Http,
              mockBackend: MockBackend,
              logger: Logger,
              errorHandler: ErrorHandler,
              notifications: NotificationsService
            ) => {
              mockBackend.connections.subscribe((connection: MockConnection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                  body: JSON.stringify(data),
                  status: 200
                })));
              });
              return new OAuthConfigStore(http, mockUserService, logger, errorHandler, notifications);
            }),
            deps: [Http, XHRBackend, Logger, ErrorHandler, NotificationsService]
          }
        ]
      });

      mockBackend = TestBed.get(XHRBackend);
      oauthStore = TestBed.get(OAuthConfigStore);
    });

    it('should load and set latest oauthconfig on init', (done: DoneFn) => {
      mockUserService.loggedInUser.connect();

      subscriptions.push(oauthStore.loading.subscribe((val: boolean) => {
        if (!val) {
          subscriptions.push(oauthStore.resource.subscribe((config: OAuthConfig) => {
            expect(config.loaded).toBeTruthy();
            done();
          }));
        }
      }));
    });

    it('should set openshift console on init', (done: DoneFn) => {
      mockUserService.loggedInUser.connect();

      subscriptions.push(oauthStore.loading.subscribe((val: boolean) => {
        if (!val) {
          subscriptions.push(oauthStore.resource.subscribe((config: OAuthConfig) => {
            expect(config.loaded).toBeTruthy();
            expect(config.openshiftConsoleUrl).toEqual('http://console.example.com/cluster/console');
            done();
          }));
        }
      }));
    });
  });


  describe('user service error', () => {
    beforeEach(() => {
      mockUserService = createMock(UserService);
      mockUserService.loggedInUser = Observable.throw({error : 'error'}).publish();

      TestBed.configureTestingModule({
        imports: [HttpModule],
        providers: [
          {
            provide: XHRBackend, useClass: MockBackend
          },
          {
            provide: UserService, useClass: mockUserService
          },
          {
            provide: Logger, useValue: mockLogger
          },
          {
            provide: ErrorHandler, useValue: mockErrorHandler
          },
          {
            provide: NotificationsService, useValue: mockNotificationsService
          },
          {
            // provide OAuthConfigStore with a factory inside the fakeAsync zone
            // so the mockBackend can catch http requests made inside the constructor
            provide: OAuthConfigStore, useFactory: fakeAsync((
              http: Http,
              mockBackend: MockBackend,
              logger: Logger,
              errorHandler: ErrorHandler,
              notifications: NotificationsService
            ) => {
              mockBackend.connections.subscribe((connection: MockConnection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                  body: JSON.stringify(data),
                  status: 200
                })));
              });
              return new OAuthConfigStore(http, mockUserService, logger, errorHandler, notifications);
            }),
            deps: [Http, XHRBackend, Logger, ErrorHandler, NotificationsService]
          }
        ]
      });

      mockBackend = TestBed.get(XHRBackend);
      oauthStore = TestBed.get(OAuthConfigStore);
    });

    it('should notify on user service error', (done: DoneFn) => {
      mockUserService.loggedInUser.connect();
      subscriptions.push(oauthStore.loading.subscribe((val: boolean) => {
        expect(val).toBeFalsy();
        expect(mockLogger.error).toHaveBeenCalled();
        expect(mockErrorHandler.handleError).toHaveBeenCalled();
        expect(mockNotificationsService.message).toHaveBeenCalled();
        done();
      }));
    });
  });

  describe('config request error', () => {
    beforeEach(() => {
      mockUserService = createMock(UserService);
      mockUserService.loggedInUser = Observable.of(user).publish();

      TestBed.configureTestingModule({
        imports: [HttpModule],
        providers: [
          {
            provide: XHRBackend, useClass: MockBackend
          },
          {
            provide: UserService, useClass: mockUserService
          },
          {
            provide: Logger, useValue: mockLogger
          },
          {
            provide: ErrorHandler, useValue: mockErrorHandler
          },
          {
            provide: NotificationsService, useValue: mockNotificationsService
          },
          {
            // provide OAuthConfigStore with a factory inside the fakeAsync zone
            // so the mockBackend can catch http requests made inside the constructor
            provide: OAuthConfigStore, useFactory: fakeAsync((
              http: Http,
              mockBackend: MockBackend,
              logger: Logger,
              errorHandler: ErrorHandler,
              notifications: NotificationsService
            ) => {
              mockBackend.connections.subscribe((connection: MockConnection) => {
                connection.mockError(new Response(new ResponseOptions({
                  type: ResponseType.Error,
                  body: JSON.stringify('Mock HTTP Error'),
                  status: 404
                })) as Response & Error);
              });
              return new OAuthConfigStore(http, mockUserService, logger, errorHandler, notifications);
            }),
            deps: [Http, XHRBackend, Logger, ErrorHandler, NotificationsService]
          }
        ]
      });


      mockBackend = TestBed.get(XHRBackend);
      oauthStore = TestBed.get(OAuthConfigStore);
    });

    it('should notify on config http error', (done: DoneFn) => {
      mockUserService.loggedInUser.connect();
      subscriptions.push(oauthStore.loading.subscribe((val: boolean) => {
        if (!val) {
          expect(mockLogger.error).toHaveBeenCalled();
          expect(mockErrorHandler.handleError).toHaveBeenCalled();
          expect(mockNotificationsService.message).toHaveBeenCalled();
          done();
        }
      }));
    });
  });
});
