import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { cloneDeep } from 'lodash';
import { first } from 'rxjs/operators';

import { createMock } from 'testing/mock';
import { spaceMock } from './context.service.mock';

import { Logger } from 'ngx-base';
import { Space, SpaceService, WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

import { of } from 'rxjs';
import {
  SpaceInformation,
  UserSpacesResponse,
  UserSpacesService
} from './user-spaces.service';

describe('UserSpacesService', () => {

  let service: UserSpacesService;
  let controller: HttpTestingController;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        {
          provide: AuthenticationService, useFactory: (): AuthenticationService => {
            const authSvc: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
            authSvc.getToken.and.returnValue('mock-auth-token');
            return authSvc;
          }
        },
        {
          provide: ErrorHandler, useFactory: (): ErrorHandler => {
            const handler: jasmine.SpyObj<ErrorHandler> = createMock(ErrorHandler);
            handler.handleError.and.stub();
            return handler;
          }
        },
        {
          provide: Logger, useFactory: (): Logger => {
            const logger: jasmine.SpyObj<Logger> = createMock(Logger);
            logger.error.and.stub();
            return logger;
          }
        },
        {
          provide: SpaceService,
          useFactory: (): SpaceService => {
            const spaceService: jasmine.SpyObj<SpaceService> = createMock(SpaceService);
            return spaceService;
          }
        },
        {
          provide: WIT_API_URL, useValue: 'http://example.com/'
        },
        UserSpacesService
      ]
    });
    service = TestBed.get(UserSpacesService);
    controller = TestBed.get(HttpTestingController);
  });

  describe('#getInvolvedSpacesCount', (): void => {
    it('should return 0 result based on totalCount', (done: DoneFn): void => {
      const httpResponse: UserSpacesResponse = {
        data: [],
        meta: {
          totalCount: 0
        }
      };
      service.getInvolvedSpacesCount().pipe(
        first()
      ).subscribe((count: number): void => {
        expect(count).toEqual(httpResponse.meta.totalCount);
        controller.verify();
        done();
      });

      const req: TestRequest = controller.expectOne('http://example.com/user/spaces');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush(httpResponse);
    });

    it('should return non-0 result based on totalCount', (done: DoneFn): void => {
      const httpResponse: UserSpacesResponse = {
        data: [],
        meta: {
          totalCount: 5
        }
      };
      service.getInvolvedSpacesCount().pipe(
        first()
      ).subscribe((count: number): void => {
        expect(count).toEqual(httpResponse.meta.totalCount);
        controller.verify();
        done();
      });

      const req: TestRequest = controller.expectOne('http://example.com/user/spaces');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush(httpResponse);
    });

    it('should report errors', (done: DoneFn): void => {
      service.getInvolvedSpacesCount().pipe(
        first()
      ).subscribe(
        (count: number): void => {
          expect(count).toEqual(0);
          expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
          expect(TestBed.get(Logger).error).toHaveBeenCalled();
          done();
        },
        (): void => {
          done.fail('should continue with 0 value');
        }
      );

      const req: TestRequest = controller.expectOne('http://example.com/user/spaces');
      req.error(new ErrorEvent('Mock HTTP Error'));
    });
  });

  describe('#getInvolvedSpaces', (): void => {
    it('should return the data portion of the response', (done: DoneFn): void => {
      const mockSpaceInformation: SpaceInformation[] = [{
        attributes: {
          name: 'mock-space'
        },
        id: 'mock-space-id',
        links: {
          self: 'mock-self'
        },
        type: 'mock-type'
      }];

      const httpResponse: UserSpacesResponse = {
        data: mockSpaceInformation,
        meta: {
          totalCount: 1
        }
      };
      service.getInvolvedSpaces().pipe(
        first()
      ).subscribe((spaceInformation: SpaceInformation[]): void => {
        expect(spaceInformation).toEqual(mockSpaceInformation);
        controller.verify();
        done();
      });

      const req: TestRequest = controller.expectOne('http://example.com/user/spaces');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush(httpResponse);
    });

    it('should report errors', (done: DoneFn): void => {
      service.getInvolvedSpaces().pipe(
        first()
      ).subscribe(
        (spaceInformation: SpaceInformation[]): void => {
          expect(spaceInformation).toEqual([]);
          expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
          expect(TestBed.get(Logger).error).toHaveBeenCalled();
          done();
        },
        (): void => {
          done.fail('should continue with 0 value');
        }
      );

      const req: TestRequest = controller.expectOne('http://example.com/user/spaces');
      req.error(new ErrorEvent('Mock HTTP Error'));
    });
  });

  describe('#getSharedSpaces', (): void => {
    it('should return spaces the user is a collaborator on', (done: DoneFn): void => {
      const username: string = 'mock-username';
      const spaceMock1 = cloneDeep(spaceMock);
      spaceMock.id = '1';
      spaceMock.attributes.name = 'spaceMock1-name';
      const spaceMock2 = cloneDeep(spaceMock);
      spaceMock.id = '2';
      spaceMock.attributes.name = 'spaceMock2-name';
      const spaceMock3 = cloneDeep(spaceMock);
      spaceMock.id = '3';
      spaceMock.attributes.name = 'spaceMock3-name';
      // mock user is involved on three spaces, but only owns two
      spyOn(service, 'getInvolvedSpaces').and.returnValue(of([spaceMock1, spaceMock2, spaceMock3]));
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spaceService.getSpacesByUser.and.returnValue(of([spaceMock1, spaceMock2]));
      spaceService.getSpaceById.and.returnValue([spaceMock3]);
      service.getSharedSpaces(username).subscribe((spaces: Space[]): void => {
        expect(spaces).toEqual([spaceMock3]);
        done();
      });
    });
  });

});
