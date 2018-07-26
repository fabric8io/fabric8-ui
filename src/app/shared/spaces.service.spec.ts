import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from 'angular-2-local-storage';
import { Broadcaster } from 'ngx-base';
import { Context, Contexts, Space, SpaceService } from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';
import { ConnectableObservable, Observable } from 'rxjs';
import { createMock } from 'testing/mock';
import { ExtProfile, ProfileService } from '../profile/profile.service';
import { SpacesService } from './spaces.service';

describe('SpacesService', () => {

  let mockSpace: Space;
  let mockContext: Context;
  let mockProfile: ExtProfile;
  let mockUser: User;

  beforeEach(() => {

    mockSpace = {
      name: 'mock-space-name-1',
      path: 'mock-space-path-1' as String,
      id: 'mock-space-id-1',
      attributes: {
        name: 'mock-space-name-1',
        description: 'mock-space-description-1'
      }
    } as Space;

    mockContext = {
      'user': {
        'attributes': {
          'username': 'mock-username'
        },
        'id': 'mock-user'
      },
      'space': mockSpace
    } as Context;

    mockProfile = {
      store: {
        recentSpaces: [mockSpace]
      }
    } as ExtProfile;

    mockUser = {
      attributes: mockProfile,
      id: 'mock-id',
      type: 'mock-type'
    } as User;

    TestBed.configureTestingModule({
      providers: [
        SpacesService,
        { provide: Broadcaster,
          useFactory: () => {
            const mockBroadcaster: jasmine.SpyObj<Broadcaster> = createMock(Broadcaster);
            mockBroadcaster.on.and.callFake((key: string): Observable<Space> => {
              if (key === 'spaceChanged') {
                return Observable.of(mockSpace);
              }
              if (key === 'spaceUpdated') {
                return Observable.of(mockSpace);
              }
            });
            return mockBroadcaster;
          }
        },
        { provide: ProfileService,
          useFactory: () => {
            const mockProfileService: any = jasmine.createSpyObj('ProfileService', ['silentSave']);
            mockProfileService.current = Observable.of(mockProfile);
            return mockProfileService;
          }
        },
        {
          provide: Contexts,
          useFactory: () => {
            const mockContexts: jasmine.SpyObj<Contexts> = createMock(Contexts);
            mockContexts.current = Observable.of(mockContext) as ConnectableObservable<Context> & jasmine.Spy;
            return mockContexts;
          }
        },
        {
          provide: LocalStorageService,
          useFactory: () => {
            const mockLocalStorageService: jasmine.SpyObj<LocalStorageService> = createMock(LocalStorageService);
            return mockLocalStorageService;
          }
        },
        {
          provide: SpaceService,
          useFactory: () => {
            const mockSpaceService: jasmine.SpyObj<SpaceService> = createMock(SpaceService);
            mockSpaceService.getSpaceById.and.returnValue(Observable.of(mockSpace));
            return mockSpaceService;
          }
        }
      ]
    });
  });

  describe('#get current', () => {
    it('should return the space from contexts.current', (done: DoneFn) => {
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      broadcaster.on.and.returnValue(Observable.never());
      const spacesService: SpacesService = TestBed.get(SpacesService);
      let result: Observable<Space> = spacesService.current;
      result.subscribe((r: Space) => {
        expect(r).toEqual(mockSpace);
        done();
      });
    });
  });

  describe('#get recent', () => {
    it('should return the spaces from the profileService.store', () => {
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      broadcaster.on.and.returnValue(Observable.never());
      const spacesService: SpacesService = TestBed.get(SpacesService);
      let result: Observable<Space[]> = spacesService.recent;
      result.subscribe((r: Space[]) => {
        expect(r).toEqual([mockSpace] as Space[]);
      });
    });
  });

  describe('#loadRecent', () => {
    it('should return an empty array if recentSpaces doesn\'t exist on profile.store', () => {
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      broadcaster.on.and.returnValue(Observable.never());
      delete mockProfile.store.recentSpaces;
      const spacesService: SpacesService = TestBed.get(SpacesService);
      let result: Observable<Space[]> = spacesService.recent;
      result.subscribe((r: Space[]) => {
        expect(r).toEqual([] as Space[]);
      });
    });
  });

  describe('#saveRecent', () => {
    it('should silentSave after a spaceChanged has been broadcasted', () => {
      const profileService: jasmine.SpyObj<ProfileService> = TestBed.get(ProfileService);
      profileService.silentSave.and.returnValue(Observable.of(mockUser));
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      let expectedPatch = {
        store: {
          recentSpaces: [mockSpace.id]
        }
      };
      spyOn(console, 'log');
      const spacesService: SpacesService = TestBed.get(SpacesService);
      expect(profileService.silentSave).toHaveBeenCalledWith(expectedPatch);
      expect(console.log).toHaveBeenCalledTimes(0);
    });

    it('should log an error if silentSave failed', () => {
      const profileService: jasmine.SpyObj<ProfileService> = TestBed.get(ProfileService);
      profileService.silentSave.and.returnValue(Observable.throw('error'));
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      let expectedPatch = {
        store: {
          recentSpaces: [mockSpace.id]
        }
      };
      spyOn(console, 'log');
      const spacesService: SpacesService = TestBed.get(SpacesService);
      expect(profileService.silentSave).toHaveBeenCalledWith(expectedPatch);
      expect(console.log).toHaveBeenCalledWith('Error saving recent spaces:', 'error');
    });
  });

});
