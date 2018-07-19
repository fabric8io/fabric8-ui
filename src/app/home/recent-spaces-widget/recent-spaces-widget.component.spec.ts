import {
  Component,
  ErrorHandler,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Observable,
  Subject
} from 'rxjs';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import {
  Broadcaster,
  Logger
} from 'ngx-base';
import {
  Fabric8WitModule,
  Space,
  Spaces,
  SpaceService
} from 'ngx-fabric8-wit';
import {
  User,
  UserService
} from 'ngx-login-client';

import { RecentSpacesWidget } from './recent-spaces-widget.component';

@Component({
  template: '<fabric8-recent-spaces-widget></fabric8-recent-spaces-widget>'
})
class HostComponent { }

describe('RecentSpacesWidget', () => {
  type TestingContext = TestContext<RecentSpacesWidget, HostComponent>;

  initContext(RecentSpacesWidget, HostComponent, {
    imports: [
      Fabric8WitModule,
      RouterTestingModule
    ],
    providers: [
      {
        provide: Broadcaster,
        useFactory: (): jasmine.SpyObj<Broadcaster> => {
          const broadcaster: jasmine.SpyObj<Broadcaster> = createMock(Broadcaster);
          broadcaster.broadcast.and.stub();
          return broadcaster;
        }
      },
      {
        provide: Logger,
        useFactory: (): jasmine.SpyObj<Logger> => {
          const logger: jasmine.SpyObj<Logger> = createMock(Logger);
          logger.error.and.stub();
          return logger;
        }
      },
      {
        provide: ErrorHandler,
        useFactory: (): jasmine.SpyObj<ErrorHandler> => {
          const errorHandler: jasmine.SpyObj<ErrorHandler> = createMock(ErrorHandler);
          errorHandler.handleError.and.stub();
          return errorHandler;
        }
      },
      {
        provide: Spaces,
        useFactory: (): Spaces => {
          return {
            recent: new Subject<Space[]>(),
            current: Observable.throw('unimplemented')
          } as Spaces;
        }
      },
      {
        provide: UserService,
        useFactory: (): UserService => {
          return {
            currentLoggedInUser: {
              attributes: {
                username: 'fooUser'
              }
            } as User
          } as UserService;
        }
      },
      {
        provide: SpaceService,
        useFactory: (): jasmine.SpyObj<SpaceService> => {
          const service: jasmine.SpyObj<SpaceService> = createMock(SpaceService);
          service.getSpacesByUser.and.returnValue(new Subject<Space[]>());
          return service;
        }
      }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  });

  it('should be instantiable', function(this: TestingContext): void {
    expect(this.testedDirective).toBeTruthy();
  });

  it('should use currentLoggedInUser username', function(this: TestingContext): void {
    const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
    expect(spaceService.getSpacesByUser).toHaveBeenCalledWith('fooUser');
  });

  describe('recentSpaces', () => {
    it('should relay empty results', function(this: TestingContext, done: DoneFn): void {
      this.testedDirective.recentSpaces.first().subscribe(function(spaces: Space[]): void {
        expect(spaces).toEqual([]);
        done();
      });
      const spaces: Spaces = TestBed.get(Spaces);
      (spaces.recent as Subject<Space[]>).next([]);
    });

    it('should relay nonempty results', function(this: TestingContext, done: DoneFn): void {
      const mockSpaces: Space[] = [
        {
          attributes: {
            name: 'spaceA'
          },
          relationalData: {
            creator: {
              attributes: {
                username: 'userA'
              }
            }
          }
        } as Space,
        {
          attributes: {
            name: 'spaceB'
          },
          relationalData: {
            creator: {
              attributes: {
                username: 'userB'
              }
            }
          }
        } as Space
      ];
      this.testedDirective.recentSpaces.first().subscribe(function(spaces: Space[]): void {
        expect(spaces).toEqual(mockSpaces);
        done();
      });
      const spaces: Spaces = TestBed.get(Spaces);
      (spaces.recent as Subject<Space[]>).next(mockSpaces);
    });
  });

  describe('userHasSpaces', () => {
    it('should emit "true" if space array is nonempty', function(this: TestingContext, done: DoneFn): void {
      this.testedDirective.userHasSpaces.first().subscribe((hasSpaces: boolean): void => {
        expect(hasSpaces).toBeTruthy();
        done();
      });
      const service: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      (service.getSpacesByUser() as Subject<Space[]>).next(
        [
          {
            attributes: {
              name: 'spaceA'
            },
            relationalData: {
              creator: {
                attributes: {
                  username: 'userA'
                }
              }
            }
          } as Space
        ]
      );
    });

    it('should emit "false" if space array is empty', function(this: TestingContext, done: DoneFn): void {
      this.testedDirective.userHasSpaces.first().subscribe((hasSpaces: boolean): void => {
        expect(hasSpaces).toBeFalsy();
        done();
      });
      const service: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      (service.getSpacesByUser() as Subject<Space[]>).next([]);
    });
  });

  describe('error handling', () => {
    it('should log errors if SpaceService emits errors', function(this: TestingContext): void {
      const logger: jasmine.SpyObj<Logger> = TestBed.get(Logger);
      expect(logger.error).not.toHaveBeenCalled();
      const service: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      (service.getSpacesByUser() as Subject<Space[]>).error('Some HTTP error');
      expect(logger.error).toHaveBeenCalledWith('Some HTTP error');
        const errorHandler: jasmine.SpyObj<ErrorHandler> = TestBed.get(ErrorHandler);
        expect(errorHandler.handleError).toHaveBeenCalledWith('Some HTTP error');
    });
  });

  describe('showAddSpaceOverlay', () => {
    it('should trigger broadcast event', function(this: TestingContext) {
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      expect(broadcaster.broadcast).not.toHaveBeenCalled();
      this.testedDirective.showAddSpaceOverlay();
      expect(broadcaster.broadcast).toHaveBeenCalledWith('showAddSpaceOverlay', true);
    });
  });
});
