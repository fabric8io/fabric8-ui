import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { first } from 'rxjs/operators';
import { createMock } from 'testing/mock';
import {
  Workspace,
  WorkspaceLinks
} from './workspace';
import { WorkspacesService } from './workspaces.service';

describe('WorkspacesService', () => {

  type TestContext = {
    service: WorkspacesService;
    controller: HttpTestingController;
  };

  beforeEach(function(this: TestContext): void {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        WorkspacesService,
        {
          provide: WIT_API_URL,
          useValue: 'https://example.com/api/'
        },
        {
          provide: AuthenticationService,
          useFactory: (): jasmine.SpyObj<AuthenticationService> => {
            const svc: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
            svc.getToken.and.returnValue('mock-auth-token');
            return svc;
          }
        },
        {
          provide: Logger,
          useFactory: (): jasmine.SpyObj<Logger> => createMock(Logger)
        }
      ]
    });
    this.service = TestBed.get(WorkspacesService);
    this.controller = TestBed.get(HttpTestingController);
  });

  it('should be instantiable', function(this: TestContext): void {
    expect(this.service).toBeDefined();
  });

  describe('#createWorkspace', () => {
    it('should send Authorization header', function(this: TestContext, done: DoneFn): void {
      this.service
        .createWorkspace('mockId').pipe(
        first())
        .subscribe((): void => {
          this.controller.verify();
          done();
        });
      const req: TestRequest = this.controller.expectOne('https://example.com/api/codebases/mockId/create');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush({});
    });

    it('should send POST request', function(this: TestContext, done: DoneFn): void {
      this.service
        .createWorkspace('mockId').pipe(
        first())
        .subscribe((): void => {
          this.controller.verify();
          done();
        });
      const req: TestRequest = this.controller.expectOne('https://example.com/api/codebases/mockId/create');
      expect(req.request.method).toEqual('POST');
      req.flush({});
    });

    it('should return correct data', function(this: TestContext, done: DoneFn): void {
      const expectedResponse: WorkspaceLinks = {
        links: {
          open: 'https://example.com/workspaces/1'
        }
      };
      this.service
        .createWorkspace('mockId').pipe(
        first())
        .subscribe((links: WorkspaceLinks): void => {
          expect(links).toEqual(expectedResponse);
          this.controller.verify();
          done();
        });
      this.controller.expectOne('https://example.com/api/codebases/mockId/create').flush(expectedResponse);
    });
  });

  describe('#getWorkspaces', () => {
    it('should send Authorization header', function(this: TestContext, done: DoneFn): void {
      this.service
        .getWorkspaces('mockId').pipe(
        first())
        .subscribe((): void => {
          this.controller.verify();
          done();
        });
      const req: TestRequest = this.controller.expectOne('https://example.com/api/codebases/mockId/workspaces');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush({});
    });

    it('should send GET request', function(this: TestContext, done: DoneFn): void {
      this.service
        .getWorkspaces('mockId').pipe(
        first())
        .subscribe((): void => {
          this.controller.verify();
          done();
        });
      const req: TestRequest = this.controller.expectOne('https://example.com/api/codebases/mockId/workspaces');
      expect(req.request.method).toEqual('GET');
      req.flush({});
    });

    it('should return correct data', function(this: TestContext, done: DoneFn): void {
      const expectedResponse: Workspace[] = [
        {
          type: 'workspace',
          attributes: {
            name: 'foo-space',
            description: 'this is a mock workspace'
          }
        }
      ];
      this.service
        .getWorkspaces('mockId').pipe(
        first())
        .subscribe((workspaces: Workspace[]): void => {
          expect(workspaces).toEqual(expectedResponse);
          this.controller.verify();
          done();
        });
      this.controller.expectOne('https://example.com/api/codebases/mockId/workspaces').flush({ data: expectedResponse });
    });
  });

  describe('#openWorkspace', () => {
    it('should send Authorization header', function(this: TestContext, done: DoneFn): void {
      this.service
        .openWorkspace('https://example.com/workspaces/1').pipe(
        first())
        .subscribe((): void => {
          this.controller.verify();
          done();
        });
      const req: TestRequest = this.controller.expectOne('https://example.com/workspaces/1');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush({});
    });

    it('should send POST request', function(this: TestContext, done: DoneFn): void {
      this.service
        .openWorkspace('https://example.com/workspaces/1').pipe(
        first())
        .subscribe((): void => {
          this.controller.verify();
          done();
        });
      const req: TestRequest = this.controller.expectOne('https://example.com/workspaces/1');
      expect(req.request.method).toEqual('POST');
      req.flush({});
    });

    it('should return correct data', function(this: TestContext, done: DoneFn): void {
      const expectedResponse: WorkspaceLinks = {
        links: {
          open: 'https://example.com/workspaces/1'
        }
      };
      this.service
        .openWorkspace('https://example.com/workspaces/1').pipe(
        first())
        .subscribe((links: WorkspaceLinks): void => {
          expect(links).toEqual(expectedResponse);
          this.controller.verify();
          done();
        });
      this.controller.expectOne('https://example.com/workspaces/1').flush(expectedResponse);
    });
  });

});
