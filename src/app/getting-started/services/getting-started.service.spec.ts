import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { createMock } from 'testing/mock';

import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import {
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';

import {
  ExtProfile,
  ExtUser,
  GettingStartedService
} from './getting-started.service';

describe('GettingStartedService', () => {

  type TestContext = {
    service: GettingStartedService;
    controller: HttpTestingController;
  };

  beforeEach(function(this: TestContext): void {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        GettingStartedService,
        {
          provide: AuthenticationService,
          useFactory: (): jasmine.SpyObj<AuthenticationService> => {
            const svc: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
            svc.getToken.and.returnValue('mock-auth-token');
            return svc;
          }
        },
        {
          provide: UserService,
          useFactory: (): jasmine.SpyObj<UserService> => createMock(UserService)
        },
        {
          provide: Logger,
          useFactory: (): jasmine.SpyObj<Logger> => createMock(Logger)
        },
        { provide: WIT_API_URL, useValue: 'https://example.com/api/' }
      ]
    });
    this.service = TestBed.get(GettingStartedService);
    this.controller = TestBed.get(HttpTestingController);
  });

  it('should be instantiable', function(this: TestContext): void {
    expect(this.service).toBeDefined();
  });

  describe('#createTransientProfile', () => {
    it('should return transient profile', function(this: TestContext): void {
      const userData: ExtUser = {
        attributes: {
          username: 'example-user',
          contextInformation: {
            foo: 'bar'
          }
        }
      } as ExtUser;
      TestBed.get(UserService).loggedInUser = Observable.of(userData);
      expect(this.service.createTransientProfile()).toEqual(userData.attributes);
    });

    it('should populate empty contextInformation', function(this: TestContext): void {
      const userData: ExtUser = {
        attributes: {
          username: 'example-user'
        }
      } as ExtUser;
      TestBed.get(UserService).loggedInUser = Observable.of(userData);
      expect(this.service.createTransientProfile()).toEqual({
        username: 'example-user',
        contextInformation: {}
      } as ExtProfile);
    });

    it('should return an empty object if no user is logged in', function(this: TestContext): void {
      TestBed.get(UserService).loggedInUser = Observable.never();
      expect(this.service.createTransientProfile()).toEqual({} as ExtProfile);
    });
  });

  describe('HTTP Tests', () => {

    afterEach(function(this: TestContext): void {
      this.controller.verify();
    });

    describe('#getExtProfile', () => {
      it('should send a GET', function(this: TestContext, done: DoneFn): void {
        this.service.getExtProfile('123')
          .first()
          .subscribe((): void => {
            done();
          });
        const req: TestRequest = this.controller.expectOne('https://example.com/api/users/123');
        expect(req.request.method).toEqual('GET');
        req.flush({});
      });

      it('should send correct headers', function(this: TestContext, done: DoneFn): void {
        this.service.getExtProfile('123')
          .first()
          .subscribe((): void => {
            done();
          });
        const req: TestRequest = this.controller.expectOne('https://example.com/api/users/123');
        expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        req.flush({});
      });

      it('should return expected data', function(this: TestContext, done: DoneFn): void {
        const data: ExtUser = {
          attributes: {
            username: 'example-user'
          }
        } as ExtUser;
        this.service.getExtProfile('123')
          .first()
          .subscribe((user: ExtUser): void => {
            expect(user).toEqual(data);
            done();
          });
        this.controller.expectOne('https://example.com/api/users/123').flush({ data });
      });

      it('should propagate errors', function(this: TestContext, done: DoneFn): void {
        TestBed.get(Logger).error.and.stub();
        this.service.getExtProfile('123')
          .first()
          .subscribe(
            (): void => done.fail('should have errored'),
            (message: any): void => {
              expect(message).toEqual('Http failure response for https://example.com/api/users/123: 0 ');
              expect(TestBed.get(Logger).error).toHaveBeenCalledWith(jasmine.objectContaining({ message }));
              done();
            }
          );
        this.controller.expectOne('https://example.com/api/users/123').error(new ErrorEvent('some error message'));
      });
    });

    describe('#getUpdate', () => {
      it('should send a PATCH', function(this: TestContext, done: DoneFn): void {
        this.service.update({} as ExtProfile)
          .first()
          .subscribe((): void => {
            done();
          });
        const req: TestRequest = this.controller.expectOne('https://example.com/api/users');
        expect(req.request.method).toEqual('PATCH');
        req.flush({});
      });

      it('should send correct headers', function(this: TestContext, done: DoneFn): void {
        this.service.update({} as ExtProfile)
          .first()
          .subscribe((): void => {
            done();
          });
        const req: TestRequest = this.controller.expectOne('https://example.com/api/users');
        expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        req.flush({});
      });

      it('should send correct payload', function(this: TestContext, done: DoneFn): void {
        const attributes: ExtProfile = { username: 'updated-username' } as ExtProfile;
        this.service.update(attributes)
          .first()
          .subscribe((): void => {
            done();
          });
        const req: TestRequest = this.controller.expectOne('https://example.com/api/users');
        expect(req.request.body).toEqual(JSON.stringify({
          data: {
            attributes,
            type: 'identities'
          }
        }));
        req.flush({});
      });

      it('should return expected data', function(this: TestContext, done: DoneFn): void {
        const data: ExtUser = {
          attributes: {
            username: 'example-user'
          }
        } as ExtUser;
        this.service.update(data.attributes)
          .first()
          .subscribe((user: ExtUser): void => {
            expect(user).toEqual(data);
            done();
          });
        this.controller.expectOne('https://example.com/api/users').flush({ data });
      });

      it('should propagate errors', function(this: TestContext, done: DoneFn): void {
        TestBed.get(Logger).error.and.stub();
        this.service.update({} as ExtProfile)
          .first()
          .subscribe(
            (): void => done.fail('should have errored'),
            (message: any): void => {
              expect(message).toEqual('Http failure response for https://example.com/api/users: 0 ');
              expect(TestBed.get(Logger).error).toHaveBeenCalledWith(jasmine.objectContaining({ message }));
              done();
            }
          );
        this.controller.expectOne('https://example.com/api/users').error(new ErrorEvent('some error message'));
      });
    });

  });

});
