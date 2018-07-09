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
  Subscription
} from 'rxjs';

import { Logger } from 'ngx-base';

import { NotificationsService } from '../../../../shared/notifications.service';
import { PipelinesService } from '../../../../shared/runtime-console/pipelines.service';

import { AuthenticationService } from 'ngx-login-client';

import { WIT_API_URL } from 'ngx-fabric8-wit';

//Avoid naming collision
import { PipelinesService as ActualPipelinesService } from './pipelines.service';

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
  let svc: ActualPipelinesService;

  let mockRuntimePipelinesService = {
    get current() { return ''; },
    get recentPipelines() { return ''; }
  };

  beforeEach(() => {
    mockLogger = jasmine.createSpyObj<Logger>('Logger', ['error']);
    mockErrorHandler = jasmine.createSpyObj<ErrorHandler>('ErrorHandler', ['handleError']);
    mockNotificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']);

    spyOnProperty(mockRuntimePipelinesService, 'current', 'get').and.returnValue(Observable.of([
      {
        id: 'app',
        name: 'app',
        gitUrl: 'https://example.com/app.git',
        interestingBuilds: [
          {
            buildNumber: 1
          },
          {
            buildNumber: 2
          }
        ],
        labels: {
          space: 'space'
        }
      },
      {
        id: 'app2',
        name: 'app2',
        gitUrl: 'https://example.com/app2.git',
        labels: {
          space: 'space'
        }
      }
    ]));

    spyOnProperty(mockRuntimePipelinesService, 'recentPipelines', 'get').and.returnValue(Observable.of([
      {
        id: 'app2',
        name: 'app2',
        gitUrl: 'https://example.com/app2.git',
        labels: {
          space: 'space'
        }
      }
    ]));
  });

  describe('auth token available', () => {
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
          {
            provide: PipelinesService, useValue: mockRuntimePipelinesService
          },
          ActualPipelinesService
        ]
      });
      svc = TestBed.get(ActualPipelinesService);
      mockBackend = TestBed.get(XHRBackend);
    });

    describe('getCurrentPipelines and getRecentPipelines', () => {
      describe('url available', () => {
        beforeEach(() => {
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
        });

        it('should inject urls into current pipelines result', (done: DoneFn) => {
          svc.getCurrentPipelines().subscribe(pipelines => {
            expect(pipelines as any[]).toContain({
              id: 'app',
              name: 'app',
              gitUrl: 'https://example.com/app.git',
              interestingBuilds: [
                {
                  buildNumber: 1,
                  openShiftConsoleUrl: 'https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines/app/app-1'
                },
                {
                  buildNumber: 2,
                  openShiftConsoleUrl: 'https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines/app/app-2'
                }
              ],
              labels: {
                space: 'space'
              },
              openShiftConsoleUrl: 'https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines/app',
              editPipelineUrl: 'https://console.starter-us-east-2.openshift.com/console/project/blob/edit/pipelines/app'
            });
            expect(pipelines as any[]).toContain({
              id: 'app2',
              name: 'app2',
              gitUrl: 'https://example.com/app2.git',
              labels: {
                space: 'space'
              },
              openShiftConsoleUrl: 'https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines/app2',
              editPipelineUrl: 'https://console.starter-us-east-2.openshift.com/console/project/blob/edit/pipelines/app2'
            });
            done();
          });
        });

        it('should inject urls into recent pipelines result', (done: DoneFn) => {
          svc.getCurrentPipelines().subscribe(pipelines => {
            expect(pipelines as any[]).toContain({
              id: 'app2',
              name: 'app2',
              gitUrl: 'https://example.com/app2.git',
              labels: {
                space: 'space'
              },
              openShiftConsoleUrl: 'https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines/app2',
              editPipelineUrl: 'https://console.starter-us-east-2.openshift.com/console/project/blob/edit/pipelines/app2'
            });
            done();
          });
        });
      });
      describe('url not available', () => {
        beforeEach(() => {
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
        });

        it('should not inject urls into current pipelines result', (done: DoneFn) => {
          svc.getCurrentPipelines().subscribe(pipelines => {
            expect(pipelines as any[]).toContain({
              id: 'app',
              name: 'app',
              gitUrl: 'https://example.com/app.git',
              interestingBuilds: [
                {
                  buildNumber: 1
                },
                {
                  buildNumber: 2
                }
              ],
              labels: {
                space: 'space'
              }
            });
            expect(pipelines as any[]).toContain({
              id: 'app2',
              name: 'app2',
              gitUrl: 'https://example.com/app2.git',
              labels: {
                space: 'space'
              }
            });
            done();
          });
        });
        it('should not inject urls into recent pipelines result', (done: DoneFn) => {
          svc.getCurrentPipelines().subscribe(pipelines => {
            expect(pipelines as any[]).toContain({
              id: 'app2',
              name: 'app2',
              gitUrl: 'https://example.com/app2.git',
              labels: {
                space: 'space'
              }
            });
            done();
          });
        });
      });
    });

    describe('getOpenshiftConsoleUrl', () => {
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

      it('should notify error handler and logger if http response is 401 and user is logged in', (done: DoneFn) => {
        const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockError(new Response(
            new ResponseOptions({
              type: ResponseType.Error,
              status: 401
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

      describe('OK calls', () => {
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
  });

  describe('auth token unavailable', () => {
    beforeEach(() => {
      const mockAuthService: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
      mockAuthService.getToken.and.returnValue('');

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
          {
            provide: PipelinesService, useValue: mockRuntimePipelinesService
          },
          ActualPipelinesService
        ]
      });
      svc = TestBed.get(ActualPipelinesService);
      mockBackend = TestBed.get(XHRBackend);
    });

    it('should not notify error handler and logger if http response is 401 and user is not logged in', (done: DoneFn) => {
      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(new Response(
          new ResponseOptions({
            type: ResponseType.Error,
            status: 401
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
            expect(mockErrorHandler.handleError).not.toHaveBeenCalled();
            expect(mockLogger.error).not.toHaveBeenCalled();
            expect(mockNotificationsService.message).not.toHaveBeenCalled();
            done();
          }
        );
    });
  });

});
