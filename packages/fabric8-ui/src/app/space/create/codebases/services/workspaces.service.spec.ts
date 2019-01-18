import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { first } from 'rxjs/operators';
import { createMock } from 'testing/mock';
import { Workspace, WorkspaceLinks } from './workspace';
import { WorkspacesService } from './workspaces.service';

describe('WorkspacesService', () => {
  let service: WorkspacesService;
  let controller: HttpTestingController;

  beforeEach(function(): void {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WorkspacesService,
        {
          provide: WIT_API_URL,
          useValue: 'https://example.com/api/',
        },
        {
          provide: AuthenticationService,
          useFactory: (): jasmine.SpyObj<AuthenticationService> => {
            const svc: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
            svc.getToken.and.returnValue('mock-auth-token');
            return svc;
          },
        },
        {
          provide: Logger,
          useFactory: (): jasmine.SpyObj<Logger> => createMock(Logger),
        },
      ],
    });
    service = TestBed.get(WorkspacesService);
    controller = TestBed.get(HttpTestingController);
  });

  it('should be instantiable', function(): void {
    expect(service).toBeDefined();
  });

  describe('#createWorkspace', () => {
    it('should send Authorization header', function(done: DoneFn): void {
      service
        .createWorkspace('mockId')
        .pipe(first())
        .subscribe(
          (): void => {
            controller.verify();
            done();
          },
        );
      const req: TestRequest = controller.expectOne(
        'https://example.com/api/codebases/mockId/create',
      );
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush({});
    });

    it('should send POST request', function(done: DoneFn): void {
      service
        .createWorkspace('mockId')
        .pipe(first())
        .subscribe(
          (): void => {
            controller.verify();
            done();
          },
        );
      const req: TestRequest = controller.expectOne(
        'https://example.com/api/codebases/mockId/create',
      );
      expect(req.request.method).toEqual('POST');
      req.flush({});
    });

    it('should return correct data', function(done: DoneFn): void {
      const expectedResponse: WorkspaceLinks = {
        links: {
          open: 'https://example.com/workspaces/1',
        },
      };
      service
        .createWorkspace('mockId')
        .pipe(first())
        .subscribe(
          (links: WorkspaceLinks): void => {
            expect(links).toEqual(expectedResponse);
            controller.verify();
            done();
          },
        );
      controller
        .expectOne('https://example.com/api/codebases/mockId/create')
        .flush(expectedResponse);
    });
  });

  describe('#getWorkspaces', () => {
    it('should send Authorization header', function(done: DoneFn): void {
      service
        .getWorkspaces('mockId')
        .pipe(first())
        .subscribe(
          (): void => {
            controller.verify();
            done();
          },
        );
      const req: TestRequest = controller.expectOne(
        'https://example.com/api/codebases/mockId/workspaces',
      );
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush({});
    });

    it('should send GET request', function(done: DoneFn): void {
      service
        .getWorkspaces('mockId')
        .pipe(first())
        .subscribe(
          (): void => {
            controller.verify();
            done();
          },
        );
      const req: TestRequest = controller.expectOne(
        'https://example.com/api/codebases/mockId/workspaces',
      );
      expect(req.request.method).toEqual('GET');
      req.flush({});
    });

    it('should return correct data', function(done: DoneFn): void {
      const expectedResponse: Workspace[] = [
        {
          type: 'workspace',
          attributes: {
            name: 'foo-space',
            description: 'this is a mock workspace',
          },
        },
      ];
      service
        .getWorkspaces('mockId')
        .pipe(first())
        .subscribe(
          (workspaces: Workspace[]): void => {
            expect(workspaces).toEqual(expectedResponse);
            controller.verify();
            done();
          },
        );
      controller
        .expectOne('https://example.com/api/codebases/mockId/workspaces')
        .flush({ data: expectedResponse });
    });
  });

  describe('#openWorkspace', () => {
    it('should send Authorization header', function(done: DoneFn): void {
      service
        .openWorkspace('https://example.com/workspaces/1')
        .pipe(first())
        .subscribe(
          (): void => {
            controller.verify();
            done();
          },
        );
      const req: TestRequest = controller.expectOne('https://example.com/workspaces/1');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush({});
    });

    it('should send POST request', function(done: DoneFn): void {
      service
        .openWorkspace('https://example.com/workspaces/1')
        .pipe(first())
        .subscribe(
          (): void => {
            controller.verify();
            done();
          },
        );
      const req: TestRequest = controller.expectOne('https://example.com/workspaces/1');
      expect(req.request.method).toEqual('POST');
      req.flush({});
    });

    it('should return correct data', function(done: DoneFn): void {
      const expectedResponse: WorkspaceLinks = {
        links: {
          open: 'https://example.com/workspaces/1',
        },
      };
      service
        .openWorkspace('https://example.com/workspaces/1')
        .pipe(first())
        .subscribe(
          (links: WorkspaceLinks): void => {
            expect(links).toEqual(expectedResponse);
            controller.verify();
            done();
          },
        );
      controller.expectOne('https://example.com/workspaces/1').flush(expectedResponse);
    });
  });
});
