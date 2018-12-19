import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { createMock } from 'testing/mock';
import { NotificationsService } from '../../../../shared/notifications.service';
import { PipelinesService } from '../../../../shared/runtime-console/pipelines.service';

//Avoid naming collision
import { PipelinesService as ActualPipelinesService } from './pipelines.service';

describe('Pipelines Service', () => {
  let controller: HttpTestingController;
  let mockLogger: jasmine.SpyObj<Logger>;
  let mockErrorHandler: jasmine.SpyObj<ErrorHandler>;
  let mockNotificationsService: jasmine.SpyObj<NotificationsService>;
  let svc: ActualPipelinesService;

  let mockRuntimePipelinesService = {
    get current() {
      return '';
    },
    get recentPipelines() {
      return '';
    },
  };

  beforeEach(() => {
    mockLogger = jasmine.createSpyObj<Logger>('Logger', ['error']);
    mockErrorHandler = jasmine.createSpyObj<ErrorHandler>('ErrorHandler', ['handleError']);
    mockNotificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', [
      'message',
    ]);

    spyOnProperty(mockRuntimePipelinesService, 'current', 'get').and.returnValue(
      observableOf([
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1,
            },
            {
              buildNumber: 2,
            },
          ],
          labels: {
            space: 'space',
          },
        },
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
      ]),
    );

    spyOnProperty(mockRuntimePipelinesService, 'recentPipelines', 'get').and.returnValue(
      observableOf([
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
      ]),
    );
  });

  describe('auth token available', () => {
    beforeEach(() => {
      const mockAuthService: jasmine.SpyObj<AuthenticationService> = createMock(
        AuthenticationService,
      );
      mockAuthService.getToken.and.returnValue('mock-auth-token');

      mockLogger = jasmine.createSpyObj<Logger>('Logger', ['error']);
      mockErrorHandler = jasmine.createSpyObj<ErrorHandler>('ErrorHandler', ['handleError']);
      mockNotificationsService = jasmine.createSpyObj<NotificationsService>(
        'NotificationsService',
        ['message'],
      );

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          {
            provide: AuthenticationService,
            useValue: mockAuthService,
          },
          {
            provide: WIT_API_URL,
            useValue: 'http://example.com/',
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
            provide: PipelinesService,
            useValue: mockRuntimePipelinesService,
          },
          ActualPipelinesService,
        ],
      });
      svc = TestBed.get(ActualPipelinesService);
      controller = TestBed.get(HttpTestingController);
    });

    describe('getCurrentPipelines and getRecentPipelines', () => {
      describe('url available', () => {
        const userServiceResponse = {
          data: {
            attributes: {
              'created-at': '2017-05-11T16:44:56.376777Z',
              namespaces: [
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:44:56.561538Z',
                  name: 'blob',
                  state: 'created',
                  type: 'user',
                  'updated-at': '2017-05-11T16:44:56.561538Z',
                  version: '1.0.91',
                },
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:45:02.916855Z',
                  name: 'blob-che',
                  state: 'created',
                  type: 'che',
                  'updated-at': '2017-05-11T16:45:02.916855Z',
                  version: '1.0.154',
                },
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:45:05.119179Z',
                  name: 'blob-jenkins',
                  state: 'created',
                  type: 'jenkins',
                  'updated-at': '2017-05-11T16:45:05.119179Z',
                  version: '1.0.154',
                },
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:45:05.296929Z',
                  name: 'blob-run',
                  state: 'created',
                  type: 'run',
                  'updated-at': '2017-05-11T16:45:05.296929Z',
                  version: '1.0.154',
                },
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:45:05.493244Z',
                  name: 'blob-stage',
                  state: 'created',
                  type: 'stage',
                  'updated-at': '2017-05-11T16:45:05.493244Z',
                  version: '1.0.154',
                },
              ],
            },
            id: 'eae1de87-f58f-4e67-977a-95024dd7c6aa',
            type: 'userservices',
          },
        };

        it('should inject urls into current pipelines result', (done: DoneFn) => {
          svc
            .getCurrentPipelines()
            .pipe(first())
            .subscribe((pipelines) => {
              expect(pipelines as any[]).toContainEqual({
                id: 'app',
                name: 'app',
                gitUrl: 'https://example.com/app.git',
                interestingBuilds: [
                  {
                    buildNumber: 1,
                    openShiftConsoleUrl:
                      'https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines/app/app-1',
                  },
                  {
                    buildNumber: 2,
                    openShiftConsoleUrl:
                      'https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines/app/app-2',
                  },
                ],
                labels: {
                  space: 'space',
                },
                openShiftConsoleUrl:
                  'https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines/app',
                editPipelineUrl:
                  'https://console.starter-us-east-2.openshift.com/console/project/blob/edit/pipelines/app',
              });
              expect(pipelines as any[]).toContainEqual({
                id: 'app2',
                name: 'app2',
                gitUrl: 'https://example.com/app2.git',
                labels: {
                  space: 'space',
                },
                openShiftConsoleUrl:
                  'https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines/app2',
                editPipelineUrl:
                  'https://console.starter-us-east-2.openshift.com/console/project/blob/edit/pipelines/app2',
              });
              controller.verify();
              done();
            });
          controller.expectOne('http://example.com/user/services').flush(userServiceResponse);
        });

        it('should inject urls into recent pipelines result', (done: DoneFn) => {
          svc
            .getCurrentPipelines()
            .pipe(first())
            .subscribe((pipelines) => {
              expect(pipelines as any[]).toContainEqual({
                id: 'app2',
                name: 'app2',
                gitUrl: 'https://example.com/app2.git',
                labels: {
                  space: 'space',
                },
                openShiftConsoleUrl:
                  'https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines/app2',
                editPipelineUrl:
                  'https://console.starter-us-east-2.openshift.com/console/project/blob/edit/pipelines/app2',
              });
              controller.verify();
              done();
            });
          controller.expectOne('http://example.com/user/services').flush(userServiceResponse);
        });
      });
    });

    describe('url not available', () => {
      beforeEach(() => {
        const userServiceResponse = {
          data: {
            attributes: {
              'created-at': '2017-05-11T16:44:56.376777Z',
              namespaces: [
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:44:56.561538Z',
                  name: 'blob',
                  state: 'created',
                  type: 'user',
                  'updated-at': '2017-05-11T16:44:56.561538Z',
                  version: '1.0.91',
                },
              ],
            },
            id: 'eae1de87-f58f-4e67-977a-95024dd7c6aa',
            type: 'userservices',
          },
        };

        it('should not inject urls into current pipelines result', (done: DoneFn) => {
          svc
            .getCurrentPipelines()
            .pipe(first())
            .subscribe((pipelines) => {
              expect(pipelines as any[]).toContainEqual({
                id: 'app',
                name: 'app',
                gitUrl: 'https://example.com/app.git',
                interestingBuilds: [
                  {
                    buildNumber: 1,
                  },
                  {
                    buildNumber: 2,
                  },
                ],
                labels: {
                  space: 'space',
                },
              });
              expect(pipelines as any[]).toContainEqual({
                id: 'app2',
                name: 'app2',
                gitUrl: 'https://example.com/app2.git',
                labels: {
                  space: 'space',
                },
              });
              controller.verify();
              done();
            });
          controller.expectOne('http://example.com/user/services').flush(userServiceResponse);
        });

        it('should not inject urls into recent pipelines result', (done: DoneFn) => {
          svc
            .getCurrentPipelines()
            .pipe(first())
            .subscribe((pipelines) => {
              expect(pipelines as any[]).toContainEqual({
                id: 'app2',
                name: 'app2',
                gitUrl: 'https://example.com/app2.git',
                labels: {
                  space: 'space',
                },
              });
              controller.verify();
              done();
            });
          controller.expectOne('http://example.com/user/services').flush(userServiceResponse);
        });
      });
    });

    describe('getOpenshiftConsoleUrl', () => {
      it('should return openshift console url if it exists', (done: DoneFn) => {
        const userServiceResponse = {
          data: {
            attributes: {
              'created-at': '2017-05-11T16:44:56.376777Z',
              namespaces: [
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:44:56.561538Z',
                  name: 'blob',
                  state: 'created',
                  type: 'user',
                  'updated-at': '2017-05-11T16:44:56.561538Z',
                  version: '1.0.91',
                },
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:45:02.916855Z',
                  name: 'blob-che',
                  state: 'created',
                  type: 'che',
                  'updated-at': '2017-05-11T16:45:02.916855Z',
                  version: '1.0.154',
                },
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:45:05.119179Z',
                  name: 'blob-jenkins',
                  state: 'created',
                  type: 'jenkins',
                  'updated-at': '2017-05-11T16:45:05.119179Z',
                  version: '1.0.154',
                },
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:45:05.296929Z',
                  name: 'blob-run',
                  state: 'created',
                  type: 'run',
                  'updated-at': '2017-05-11T16:45:05.296929Z',
                  version: '1.0.154',
                },
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:45:05.493244Z',
                  name: 'blob-stage',
                  state: 'created',
                  type: 'stage',
                  'updated-at': '2017-05-11T16:45:05.493244Z',
                  version: '1.0.154',
                },
              ],
            },
            id: 'eae1de87-f58f-4e67-977a-95024dd7c6aa',
            type: 'userservices',
          },
        };

        svc
          .getOpenshiftConsoleUrl()
          .pipe(first())
          .subscribe(
            (msg: string) => {
              expect(msg).toEqual(
                'https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines',
              );
              controller.verify();
              done();
            },
            (err: string) => {
              done.fail(err);
            },
          );
        controller.expectOne('http://example.com/user/services').flush(userServiceResponse);
      });

      it('should return empty if openshift console url does not exist', (done: DoneFn) => {
        const userServiceResponse = {
          data: {
            attributes: {
              'created-at': '2017-05-11T16:44:56.376777Z',
              namespaces: [
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:44:56.561538Z',
                  name: 'blob',
                  state: 'created',
                  type: 'user',
                  'updated-at': '2017-05-11T16:44:56.561538Z',
                  version: '1.0.91',
                },
              ],
            },
            id: 'eae1de87-f58f-4e67-977a-95024dd7c6aa',
            type: 'userservices',
          },
        };

        svc
          .getOpenshiftConsoleUrl()
          .pipe(first())
          .subscribe(
            (msg: string) => {
              expect(msg).toEqual('');
              controller.verify();
              done();
            },
            (err: string) => {
              done.fail(err);
            },
          );
        controller.expectOne('http://example.com/user/services').flush(userServiceResponse);
      });

      it('should return empty if no namespace of type user exists', (done: DoneFn) => {
        const userServiceResponse = {
          data: {
            attributes: {
              'created-at': '2017-05-11T16:44:56.376777Z',
              namespaces: [
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:44:56.561538Z',
                  name: 'blob',
                  state: 'created',
                  type: 'jenkins',
                  'updated-at': '2017-05-11T16:44:56.561538Z',
                  version: '1.0.91',
                },
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:45:02.916855Z',
                  name: 'blob-che',
                  state: 'created',
                  type: 'che',
                  'updated-at': '2017-05-11T16:45:02.916855Z',
                  version: '1.0.154',
                },
              ],
            },
            id: 'eae1de87-f58f-4e67-977a-95024dd7c6aa',
            type: 'userservices',
          },
        };

        svc
          .getOpenshiftConsoleUrl()
          .pipe(first())
          .subscribe(
            (msg: string) => {
              expect(msg).toEqual('');
              controller.verify();
              done();
            },
            (err: string) => {
              done.fail(err);
            },
          );
        controller.expectOne('http://example.com/user/services').flush(userServiceResponse);
      });

      it('should notify error handler and logger if http response is not okay', (done: DoneFn) => {
        svc.getOpenshiftConsoleUrl().subscribe(
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
            controller.verify();
            done();
          },
        );
        controller
          .expectOne('http://example.com/user/services')
          .error(new ErrorEvent('some error'));
      });

      it('should notify error handler and logger if http response is 401 and user is logged in', (done: DoneFn) => {
        svc.getOpenshiftConsoleUrl().subscribe(
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
            controller.verify();
            done();
          },
        );
        controller
          .expectOne('http://example.com/user/services')
          .error(new ErrorEvent('some error'));
      });

      describe('OK calls', () => {
        const userServiceResponse = {
          data: {
            attributes: {
              'created-at': '2017-05-11T16:44:56.376777Z',
              namespaces: [
                {
                  'cluster-app-domain': '8a09.starter-us-east-2.openshiftapps.com',
                  'cluster-console-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-logging-url': 'https://console.starter-us-east-2.openshift.com/console/',
                  'cluster-metrics-url': 'https://metrics.starter-us-east-2.openshift.com/',
                  'cluster-url': 'https://api.starter-us-east-2.openshift.com/',
                  'created-at': '2017-05-11T16:44:56.561538Z',
                  name: 'blob',
                  state: 'created',
                  type: 'user',
                  'updated-at': '2017-05-11T16:44:56.561538Z',
                  version: '1.0.91',
                },
              ],
            },
            id: 'eae1de87-f58f-4e67-977a-95024dd7c6aa',
            type: 'userservices',
          },
        };

        it('should cache console URL', (done: DoneFn) => {
          svc
            .getOpenshiftConsoleUrl()
            .pipe(first())
            .subscribe(
              (msg: string) => {
                expect(msg).toEqual(
                  'https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines',
                );
                svc
                  .getOpenshiftConsoleUrl()
                  .pipe(first())
                  .subscribe(
                    (msg: string) => {
                      expect(msg).toEqual(
                        'https://console.starter-us-east-2.openshift.com/console/project/blob/browse/pipelines',
                      );
                      controller.verify();
                      done();
                    },
                    (err: string) => {
                      done.fail(err);
                    },
                  );
                controller.expectNone('http://example.com/user/services');
              },
              (err: string) => {
                done.fail(err);
              },
            );
          controller.expectOne('http://example.com/user/services').flush(userServiceResponse);
        });
      });
    });
  });

  describe('auth token unavailable', () => {
    beforeEach(() => {
      const mockAuthService: jasmine.SpyObj<AuthenticationService> = createMock(
        AuthenticationService,
      );
      mockAuthService.getToken.and.returnValue('');

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          {
            provide: AuthenticationService,
            useValue: mockAuthService,
          },
          {
            provide: WIT_API_URL,
            useValue: 'http://example.com/',
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
            provide: PipelinesService,
            useValue: mockRuntimePipelinesService,
          },
          ActualPipelinesService,
        ],
      });
      svc = TestBed.get(ActualPipelinesService);
      controller = TestBed.get(HttpTestingController);
    });

    it('should not notify error handler and logger if http response is 401 and user is not logged in', (done: DoneFn) => {
      svc.getOpenshiftConsoleUrl().subscribe(
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
          controller.verify();
          done();
        },
      );
      controller
        .expectOne('http://example.com/user/services')
        .error(new ErrorEvent('some error'), { status: 401 });
    });
  });
});
