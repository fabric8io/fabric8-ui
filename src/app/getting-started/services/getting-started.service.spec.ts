import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import {
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';
import { never as observableNever, Observable,  of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';
import { createMock } from 'testing/mock';
import {
  ExtProfile,
  ExtUser,
  GettingStartedService
} from './getting-started.service';

describe('GettingStartedService', () => {

  let service: GettingStartedService;
  let controller: HttpTestingController;

  beforeEach(function(): void {
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
    service = TestBed.get(GettingStartedService);
    controller = TestBed.get(HttpTestingController);
  });

  it('should be instantiable', function(): void {
    expect(service).toBeDefined();
  });

  describe('#createTransientProfile', () => {
    it('should return transient profile', function(): void {
      const userData: ExtUser = {
        attributes: {
          username: 'example-user',
          contextInformation: {
            foo: 'bar'
          }
        }
      } as ExtUser;
      TestBed.get(UserService).loggedInUser = observableOf(userData);
      expect(service.createTransientProfile()).toEqual(userData.attributes);
    });

    it('should populate empty contextInformation', function(): void {
      const userData: ExtUser = {
        attributes: {
          username: 'example-user'
        }
      } as ExtUser;
      TestBed.get(UserService).loggedInUser = observableOf(userData);
      expect(service.createTransientProfile()).toEqual({
        username: 'example-user',
        contextInformation: {}
      } as ExtProfile);
    });

    it('should return an empty object if no user is logged in', function(): void {
      TestBed.get(UserService).loggedInUser = observableNever();
      expect(service.createTransientProfile()).toEqual({} as ExtProfile);
    });
  });

  describe('HTTP Tests', () => {

    afterEach(function(): void {
      controller.verify();
    });

    describe('#getExtProfile', () => {
      it('should send a GET', function(done: DoneFn): void {
        service.getExtProfile('123').pipe(
          first())
          .subscribe((): void => {
            done();
          });
        const req: TestRequest = controller.expectOne('https://example.com/api/users/123');
        expect(req.request.method).toEqual('GET');
        req.flush({});
      });

      it('should send correct headers', function(done: DoneFn): void {
        service.getExtProfile('123').pipe(
          first())
          .subscribe((): void => {
            done();
          });
        const req: TestRequest = controller.expectOne('https://example.com/api/users/123');
        expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        req.flush({});
      });

      it('should return expected data', function(done: DoneFn): void {
        const data: ExtUser = {
          attributes: {
            username: 'example-user'
          }
        } as ExtUser;
        service.getExtProfile('123').pipe(
          first())
          .subscribe((user: ExtUser): void => {
            expect(user).toEqual(data);
            done();
          });
        controller.expectOne('https://example.com/api/users/123').flush({ data });
      });

      it('should propagate errors', function(done: DoneFn): void {
        TestBed.get(Logger).error.and.stub();
        service.getExtProfile('123').pipe(
          first())
          .subscribe(
            (): void => done.fail('should have errored'),
            (message: any): void => {
              expect(message).toEqual('Http failure response for https://example.com/api/users/123: 0 ');
              expect(TestBed.get(Logger).error).toHaveBeenCalledWith(jasmine.objectContaining({ message }));
              done();
            }
          );
        controller.expectOne('https://example.com/api/users/123').error(new ErrorEvent('some error message'));
      });
    });

    describe('#getUpdate', () => {
      it('should send a PATCH', function(done: DoneFn): void {
        service.update({} as ExtProfile).pipe(
          first())
          .subscribe((): void => {
            done();
          });
        const req: TestRequest = controller.expectOne('https://example.com/api/users');
        expect(req.request.method).toEqual('PATCH');
        req.flush({});
      });

      it('should send correct headers', function(done: DoneFn): void {
        service.update({} as ExtProfile).pipe(
          first())
          .subscribe((): void => {
            done();
          });
        const req: TestRequest = controller.expectOne('https://example.com/api/users');
        expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        req.flush({});
      });

      it('should send correct payload', function(done: DoneFn): void {
        const attributes: ExtProfile = { username: 'updated-username' } as ExtProfile;
        service.update(attributes).pipe(
          first())
          .subscribe((): void => {
            done();
          });
        const req: TestRequest = controller.expectOne('https://example.com/api/users');
        expect(req.request.body).toEqual(JSON.stringify({
          data: {
            attributes,
            type: 'identities'
          }
        }));
        req.flush({});
      });

      it('should return expected data', function(done: DoneFn): void {
        const data: ExtUser = {
          attributes: {
            username: 'example-user'
          }
        } as ExtUser;
        service.update(data.attributes).pipe(
          first())
          .subscribe((user: ExtUser): void => {
            expect(user).toEqual(data);
            done();
          });
        controller.expectOne('https://example.com/api/users').flush({ data });
      });

      it('should propagate errors', function(done: DoneFn): void {
        TestBed.get(Logger).error.and.stub();
        service.update({} as ExtProfile).pipe(
          first())
          .subscribe(
            (): void => done.fail('should have errored'),
            (message: any): void => {
              expect(message).toEqual('Http failure response for https://example.com/api/users: 0 ');
              expect(TestBed.get(Logger).error).toHaveBeenCalledWith(jasmine.objectContaining({ message }));
              done();
            }
          );
        controller.expectOne('https://example.com/api/users').error(new ErrorEvent('some error message'));
      });
    });

  });

});
