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
  let mockBroadcaster: jasmine.SpyObj<Broadcaster>;
  let mockProfileService: any;

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

    mockBroadcaster = createMock(Broadcaster);
    mockBroadcaster.broadcast.and.returnValue(Observable.never());
    mockBroadcaster.on.and.callFake((key: string): Observable<Space> => {
      if (key === 'spaceChanged') {
        return Observable.of(mockSpace);
      }
      if (key === 'spaceUpdated') {
        return Observable.of(mockSpace);
      }
    });

    mockProfileService = jasmine.createSpyObj('ProfileService', ['silentSave']);
    mockProfileService.current = Observable.of(mockProfile);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SpacesService,
        { provide: Broadcaster, useValue: mockBroadcaster },
        { provide: ProfileService, useValue: mockProfileService },
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
      mockBroadcaster.on.and.returnValue(Observable.never());
      const spacesService: SpacesService = TestBed.get(SpacesService);
      let result: Observable<Space> = spacesService.current;
      result.subscribe(r => {
        expect(r).toEqual(mockSpace);
        done();
      });
    });
  });

  describe('#get recent', () => {
    it('should return the spaces from the profileService.store', () => {
      mockBroadcaster.on.and.returnValue(Observable.never());
      const spacesService: SpacesService = TestBed.get(SpacesService);
      let result: Observable<Space[]> = spacesService.recent;
      result.subscribe(r => {
        expect(r).toEqual([mockSpace] as Space[]);
      });
    });
  });

  describe('#loadRecent', () => {
    it('should return an empty array if recentSpaces doesn\'t exist on profile.store', () => {
      mockBroadcaster.on.and.returnValue(Observable.never());
      delete mockProfile.store.recentSpaces;
      const spacesService: SpacesService = TestBed.get(SpacesService);
      let result: Observable<Space[]> = spacesService.recent;
      result.subscribe(r => {
        expect(r).toEqual([] as Space[]);
      });
    });
  });

  describe('#saveRecent', () => {
    it('should silentSave after a spaceChanged has been broadcasted', () => {
      mockProfileService.silentSave.and.returnValue(Observable.of(mockUser));
      mockBroadcaster.broadcast('spaceChanged', mockSpace);
      let expectedPatch = {
        store: {
          recentSpaces: [mockSpace.id]
        }
      };
      console.log = jasmine.createSpy('log');
      const spacesService: SpacesService = TestBed.get(SpacesService);
      expect(mockProfileService.silentSave).toHaveBeenCalledWith(expectedPatch);
      expect(console.log).toHaveBeenCalledTimes(0);
    });

    it('should log an error if silentSave failed', () => {
      mockProfileService.silentSave.and.returnValue(Observable.throw('error'));
      mockBroadcaster.broadcast('spaceChanged', mockSpace);
      let expectedPatch = {
        store: {
          recentSpaces: [mockSpace.id]
        }
      };
      console.log = jasmine.createSpy('log');
      const spacesService: SpacesService = TestBed.get(SpacesService);
      expect(mockProfileService.silentSave).toHaveBeenCalledWith(expectedPatch);
      expect(console.log).toHaveBeenCalledWith('Error saving recent spaces:', 'error');
    });
  });

});
