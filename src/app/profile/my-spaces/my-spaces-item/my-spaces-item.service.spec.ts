import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  of,
  throwError
} from 'rxjs';
import { first } from 'rxjs/operators';

import { Logger } from 'ngx-base';
import {
  CollaboratorService,
  Space,
  WIT_API_URL
} from 'ngx-fabric8-wit';
import {
  AuthenticationService,
  User
} from 'ngx-login-client';
import { createMock } from 'testing/mock';

import {
  MySpacesItemService,
  workItemsQueryString,
  WorkItemsResponse
} from './my-spaces-item.service';

describe('MySpacesItemService', (): void => {

  let svc: MySpacesItemService;
  let controller: HttpTestingController;
  beforeEach((): void => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        {
          provide: CollaboratorService,
          useFactory: (): CollaboratorService => {
            const svc: jasmine.SpyObj<CollaboratorService> = createMock(CollaboratorService);
            svc.getInitialBySpaceId.and.stub();
            svc.getNextCollaborators.and.stub();
            return svc;
          }
        },
        {
          provide: AuthenticationService,
          useFactory: (): AuthenticationService => {
            const svc: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
            svc.getToken.and.returnValue('mock-auth-token');
            return svc;
          }
        },
        {
          provide: ErrorHandler,
          useFactory: (): ErrorHandler => {
            const svc: jasmine.SpyObj<ErrorHandler> = createMock(ErrorHandler);
            svc.handleError.and.stub();
            return svc;
          }
        },
        {
          provide: Logger,
          useFactory: (): Logger => {
            const svc: jasmine.SpyObj<Logger> = createMock(Logger);
            svc.error.and.stub();
            return svc;
          }
        },
        { provide: WIT_API_URL, useValue: 'http://example.com/' },
        MySpacesItemService
      ]
    });

    svc = TestBed.get(MySpacesItemService);
    controller = TestBed.get(HttpTestingController);
  });

  describe('getCollaboratorCount', (): void => {
    it('should retrieve number of collaborators from service', (done: DoneFn): void => {
      TestBed.get(CollaboratorService).getInitialBySpaceId.and.returnValue(of([{}, {}] as User[]));
      const nextCollabsSpy: jasmine.Spy = TestBed.get(CollaboratorService).getNextCollaborators;
      nextCollabsSpy.and.callFake(() => {
        if (nextCollabsSpy.calls.count() === 1) {
          return of([{}, {}, {}] as User[]);
        } else {
          return throwError('');
        }
      });

      const space: Space = { id: 'abc123 ' } as Space;
      svc.getCollaboratorCount(space)
        .pipe(first())
        .subscribe(
          (count: number): void => {
            const collabSvc: CollaboratorService = TestBed.get(CollaboratorService);
            expect(collabSvc.getInitialBySpaceId).toHaveBeenCalledWith(space.id);
            expect(collabSvc.getNextCollaborators).toHaveBeenCalled();
            expect(count).toEqual(5); // 2 from initial, 3 from next
            done();
          },
          done.fail
        );
    });

    it('should report errors', (done: DoneFn): void => {
      const collabSvc: jasmine.SpyObj<CollaboratorService> = TestBed.get(CollaboratorService);
      collabSvc.getInitialBySpaceId.and.returnValue(of([{}, {}] as User[]));
      collabSvc.getNextCollaborators.and.returnValue(throwError(''));

      const space: Space = { id: 'abc123 ' } as Space;
      svc.getCollaboratorCount(space)
        .pipe(first())
        .subscribe(
          (count: number): void => {
            expect(count).toEqual(2);
            expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
            expect(TestBed.get(Logger).error).toHaveBeenCalled();
            done();
          },
          done.fail
        );
    });
  });

  describe('getWorkItemCount', (): void => {
    it('should retrieve number of workitems from service', (done: DoneFn): void => {
      const response: WorkItemsResponse = {
        data: [],
        links: {},
        meta: {
          totalCount: 10,
          ancestorIDs: []
        },
        included: []
      };

      const space: Space = { id: 'abc123 ' } as Space;
      svc.getWorkItemCount(space)
        .pipe(first())
        .subscribe(
          (count: number): void => {
            expect(count).toEqual(response.meta.totalCount);
            done();
          },
          done.fail
        );

      const expectedUrl: string = `http://example.com/search?${workItemsQueryString(space)}`;
      const req: TestRequest = controller.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush(response);
    });

    it('should report errors', (done: DoneFn): void => {
      const space: Space = { id: 'abc123 ' } as Space;
      svc.getWorkItemCount(space)
        .pipe(first())
        .subscribe(
          (count: number): void => {
            expect(count).toEqual(0);
            expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
            expect(TestBed.get(Logger).error).toHaveBeenCalled();
            done();
          },
          done.fail
        );

      const expectedUrl: string = `http://example.com/search?${workItemsQueryString(space)}`;
      const req: TestRequest = controller.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.error(new ErrorEvent(''));
    });
  });
});
