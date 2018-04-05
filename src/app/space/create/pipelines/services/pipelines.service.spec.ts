import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
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

import { createMock } from 'testing/mock';

import {
  Observable,
  Subject,
  Subscription
} from 'rxjs';

import { Logger } from 'ngx-base';

import { NotificationsService } from 'app/shared/notifications.service';

import { AuthenticationService } from 'ngx-login-client';

import { WIT_API_URL } from 'ngx-fabric8-wit';

import { PipelinesService } from './pipelines.service';

interface MockHttpParams<U> {
  url: string;
  response: { data: {} } | Response;
  expected?: U;
  expectedError?: any;
  observable: Observable<U>;
  done: DoneFn;
}

describe('Pipelines Service', () => {

  let mockBackend: MockBackend;
  let mockLogger: jasmine.SpyObj<Logger>;
  let mockErrorHandler: jasmine.SpyObj<ErrorHandler>;
  let mockNotificationsService: jasmine.SpyObj<NotificationsService>;
  let svc: PipelinesService;

  beforeEach(() => {
    const mockAuthService: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
    mockAuthService.getToken.and.returnValue('mock-auth-token');

    mockLogger = jasmine.createSpyObj<Logger>('Logger', ['error']);
    mockErrorHandler = jasmine.createSpyObj<ErrorHandler>('ErrorHandler', ['handleError']);
    mockNotificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']);

    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: XHRBackend, useClass: MockBackend
        },
        {
          provide: AuthenticationService, useValue: mockAuthService
        },
        {
          provide: WIT_API_URL, useValue: 'http://example.com/'
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
        PipelinesService
      ]
    });
    svc = TestBed.get(PipelinesService);
    mockBackend = TestBed.get(XHRBackend);
  });

  it('should return openshift console url if it exists', (done: DoneFn) => {
    const userServiceResponse = {
      'data': {
        'attributes': {
          'created-at': '2017-05-11T16:44:56.376777Z',
          'namespaces': [{
            'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
            'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
            'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
            'created-at': '2017-05-11T16:44:56.561538Z',
            'name': 'blob',
            'state': 'created',
            'type': 'user',
            'updated-at': '2017-05-11T16:44:56.561538Z',
            'version': '1.0.91'
          }, {
            'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
            'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
            'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
            'created-at': '2017-05-11T16:45:02.916855Z',
            'name': 'blob-che',
            'state': 'created',
            'type': 'che',
            'updated-at': '2017-05-11T16:45:02.916855Z',
            'version': '1.0.154'
          }, {
            'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
            'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
            'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
            'created-at': '2017-05-11T16:45:05.119179Z',
            'name': 'blob-jenkins',
            'state': 'created',
            'type': 'jenkins',
            'updated-at': '2017-05-11T16:45:05.119179Z',
            'version': '1.0.154'
          }, {
            'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
            'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
            'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
            'created-at': '2017-05-11T16:45:05.296929Z',
            'name': 'blob-run',
            'state': 'created',
            'type': 'run',
            'updated-at': '2017-05-11T16:45:05.296929Z',
            'version': '1.0.154'
          }, {
            'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
            'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
            'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
            'created-at': '2017-05-11T16:45:05.493244Z',
            'name': 'blob-stage',
            'state': 'created',
            'type': 'stage',
            'updated-at': '2017-05-11T16:45:05.493244Z',
            'version': '1.0.154'
          }]
        },
        'id': 'eae1de87-f58f-4e67-977a-95024dd7c6aa',
        'type': 'userservices'
      }
    };

    const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(userServiceResponse),
          status: 200
        })
      ));
    });

    svc.getOpenshiftConsoleUrl()
      .subscribe(
        (msg: string) => {
          expect(msg).toEqual('https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines');
          subscription.unsubscribe();
          done();
        },
        (err: string) => {
          done.fail(err);
        }
      );
  });

  it('should return empty if openshift console url does not exist', (done: DoneFn) => {
    const userServiceResponse = {
      'data': {
        'attributes': {
          'created-at': '2017-05-11T16:44:56.376777Z',
          'namespaces': [{
            'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
            'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
            'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
            'created-at': '2017-05-11T16:44:56.561538Z',
            'name': 'blob',
            'state': 'created',
            'type': 'user',
            'updated-at': '2017-05-11T16:44:56.561538Z',
            'version': '1.0.91'
          }]
        },
        'id': 'eae1de87-f58f-4e67-977a-95024dd7c6aa',
        'type': 'userservices'
      }
    };

    const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(userServiceResponse),
          status: 200
        })
      ));
    });

    svc.getOpenshiftConsoleUrl()
      .subscribe(
        (msg: string) => {
          expect(msg).toEqual('');
          subscription.unsubscribe();
          done();
        },
        (err: string) => {
          done.fail(err);
        }
      );
  });

  it('should return empty if no namespace of type user exists', (done: DoneFn) => {
    const userServiceResponse = {
      'data': {
        'attributes': {
          'created-at': '2017-05-11T16:44:56.376777Z',
          'namespaces': [{
            'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
            'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
            'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
            'created-at': '2017-05-11T16:44:56.561538Z',
            'name': 'blob',
            'state': 'created',
            'type': 'jenkins',
            'updated-at': '2017-05-11T16:44:56.561538Z',
            'version': '1.0.91'
          }, {
            'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
            'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
            'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
            'created-at': '2017-05-11T16:45:02.916855Z',
            'name': 'blob-che',
            'state': 'created',
            'type': 'che',
            'updated-at': '2017-05-11T16:45:02.916855Z',
            'version': '1.0.154'
          }]
        },
        'id': 'eae1de87-f58f-4e67-977a-95024dd7c6aa',
        'type': 'userservices'
      }
    };

    const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(userServiceResponse),
          status: 200
        })
      ));
    });

    svc.getOpenshiftConsoleUrl()
      .subscribe(
        (msg: string) => {
          expect(msg).toEqual('');
          subscription.unsubscribe();
          done();
        },
        (err: string) => {
          done.fail(err);
        }
      );
  });

  it('should notify error handler and logger if http response is not okay', (done: DoneFn) => {
    const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
      connection.mockError(new Response(
        new ResponseOptions({
          type: ResponseType.Error,
          status: 400
        })
      ) as Response & Error);
    });

    svc.getOpenshiftConsoleUrl()
      .subscribe(
        (msg: string) => {
          done.fail(msg);
        },
        (err: string) => {
          done.fail(err);
        },
        () => {
          expect(mockErrorHandler.handleError).toHaveBeenCalled();
          expect(mockLogger.error).toHaveBeenCalled();
          expect(mockNotificationsService.message).toHaveBeenCalled();
          done();
        }
      );
  });

  describe('PipelinesService - OK calls', () => {
    const userServiceResponse = {
      'data': {
        'attributes': {
          'created-at': '2017-05-11T16:44:56.376777Z',
          'namespaces': [{
            'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
            'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
            'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
            'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
            'created-at': '2017-05-11T16:44:56.561538Z',
            'name': 'blob',
            'state': 'created',
            'type': 'user',
            'updated-at': '2017-05-11T16:44:56.561538Z',
            'version': '1.0.91'
          }]
        },
        'id': 'eae1de87-f58f-4e67-977a-95024dd7c6aa',
        'type': 'userservices'
      }
    };

    var subscription: Subscription;

    beforeEach(() => {
      subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: JSON.stringify(userServiceResponse),
            status: 200
          })
        ));
      });
    });

    it('should emit response with repeat calls', (done: DoneFn) => {
      svc.getOpenshiftConsoleUrl()
        .subscribe(
          (msg: string) => {
            expect(msg).toEqual('https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines');
            svc.getOpenshiftConsoleUrl()
            .subscribe(
              (msg: string) => {
                expect(msg).toEqual('https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines');
                done();
              },
              (err: string) => {
                done.fail(err);
              }
            );
          },
          (err: string) => {
            done.fail(err);
          }
        );
    });

    afterEach(() => {
      subscription.unsubscribe();
    });
  });

});
