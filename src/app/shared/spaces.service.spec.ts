import { TestBed } from '@angular/core/testing';
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
        recentSpaces: []
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
                return Observable.never();
              }
              if (key === 'spaceDeleted') {
                return Observable.never();
              }
              if (key === 'spaceUpdated') {
                return Observable.never();
              }
            });
            return mockBroadcaster;
          }
        },
        { provide: ProfileService,
          useFactory: () => {
            const mockProfileService: any = jasmine.createSpyObj('ProfileService', ['silentSave']);
            mockProfileService.current = Observable.of(mockProfile);
            mockProfileService.silentSave.and.returnValue(Observable.of(mockUser));
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
      mockProfile.store.recentSpaces = [mockSpace];
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
      const profileService: any = TestBed.get(ProfileService);
      mockProfile.store.recentSpaces = [mockSpace];
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      broadcaster.on.and.callFake((key: string): Observable<Space> => {
        if (key === 'spaceChanged') {
          return Observable.of(mockSpace);
        }
        if (key === 'spaceDeleted') {
          return Observable.never();
        }
        if (key === 'spaceUpdated') {
          return Observable.never();
        }
      });
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
      mockProfile.store.recentSpaces = [mockSpace];
      profileService.silentSave.and.returnValue(Observable.throw('error'));
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      broadcaster.on.and.callFake((key: string): Observable<Space> => {
        if (key === 'spaceChanged') {
          return Observable.of(mockSpace);
        }
        if (key === 'spaceDeleted') {
          return Observable.never();
        }
        if (key === 'spaceUpdated') {
          return Observable.never();
        }
      });
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

  describe('#findRecentIndexById', () => {
    it('should return the list index of the space in _recent', () => {
      const spacesService: SpacesService = TestBed.get(SpacesService);
      let result: number = spacesService.findRecentIndexById([mockSpace], mockSpace.id);
      expect(result).toEqual(0);
    });

    it('should return -1 if the space does not exist in _recent', () => {
      const spacesService: SpacesService = TestBed.get(SpacesService);
      let result: number = spacesService.findRecentIndexById([mockSpace], 'not-a-real-index');
      expect(result).toEqual(-1);
    });
  });

  describe('#initRecent - spaceChanged', () => {
    let mockSpaces: Space[] = [];
    let mockSpacesObs: Observable<Space>[] = [];
    const mockSpace8: Space = {
      name: 'mock-space-name-8',
      path: 'mock-space-path-8' as String,
      id: 'mock-space-id-8',
      attributes: {
        name: 'mock-space-name-8',
        description: 'mock-space-description-8'
      }
    } as Space;

    beforeEach(() => {
      for (let i: number = 0; i < 8; i++) {
        let space = {
          name: `mock-space-name-${i}`,
          path: `mock-space-path-${i}` as String,
          id: `mock-space-id-${i}`,
          attributes: {
            name: `mock-space-name-${i}`,
            description: `mock-space-description-${i}`
          }
        } as Space;
        mockSpaces[i] = space;
        mockSpacesObs[i] = Observable.of(space);
      }
    });

    it('should re-order _recent if updated space already exists in _recent and is not index 0', () => {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      let i: number = 0;
      spaceService.getSpaceById.and.callFake(() => {
        let spaceObs: Observable<Space> = mockSpacesObs[i];
        i++;
        return spaceObs;
      });
      const profileService: any = TestBed.get(ProfileService);
      mockProfile.store.recentSpaces = mockSpaces;
      profileService.current = Observable.of(mockProfile);
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      broadcaster.on.and.callFake((key: string): Observable<Space> => {
        if (key === 'spaceChanged') {
          return Observable.of(mockSpace);
        }
        if (key === 'spaceDeleted') {
          return Observable.never();
        }
        if (key === 'spaceUpdated') {
          return Observable.never();
        }
      });
      const spacesService: SpacesService = TestBed.get(SpacesService);
      // mock-space-1 should have been moved to the front of _recent
      spacesService.recent.subscribe(spaces => {
        expect(spaces[0].id).toEqual(mockSpace.id);
      });
    });

    it('should not re-order _recent if updated space already exists in _recent and is index 0', () => {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      let i: number = 0;
      spaceService.getSpaceById.and.callFake(() => {
        let spaceObs: Observable<Space> = mockSpacesObs[i];
        i++;
        return spaceObs;
      });
      const profileService: any = TestBed.get(ProfileService);
      mockProfile.store.recentSpaces = mockSpaces;
      profileService.current = Observable.of(mockProfile);
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      broadcaster.on.and.callFake((key: string): Observable<Space> => {
        if (key === 'spaceChanged') {
          return mockSpacesObs[0];
        }
        if (key === 'spaceDeleted') {
          return Observable.never();
        }
        if (key === 'spaceUpdated') {
          return Observable.never();
        }
      });
      const spacesService: SpacesService = TestBed.get(SpacesService);
      // mock-space-0 should stay at the front of _recent
      spacesService.recent.subscribe(spaces => {
        expect(spaces[0].id).toEqual(mockSpaces[0].id);
      });
    });

    it('should trim _recent if its length exceeds RECENT_SPACE_LENGTH', () => {
      const spaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      let i: number = 0;
      spaceService.getSpaceById.and.callFake(() => {
        let spaceObs: Observable<Space> = mockSpacesObs[i];
        i++;
        return spaceObs;
      });
      // make recentSpaces contain 8 spaces, adding another one will force a .pop()
      const profileService: any = TestBed.get(ProfileService);
      mockProfile.store.recentSpaces = mockSpaces;
      profileService.current = Observable.of(mockProfile);
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      broadcaster.on.and.callFake((key: string): Observable<Space> => {
        if (key === 'spaceChanged') {
          return Observable.of(mockSpace8);
        }
        if (key === 'spaceDeleted') {
          return Observable.never();
        }
        if (key === 'spaceUpdated') {
          return Observable.never();
        }
      });
      const spacesService: SpacesService = TestBed.get(SpacesService);
      spacesService.recent.subscribe(spaces => {
        expect(spaces.length).toEqual(SpacesService.RECENT_SPACE_LENGTH);
      });
    });
  });

  describe('#initRecent - spaceDeleted', () => {
    it('should remove deleted space from _recent', () => {
      const profileService: jasmine.SpyObj<ProfileService> = TestBed.get(ProfileService);
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      broadcaster.on.and.callFake((key: string): Observable<Space> => {
        if (key === 'spaceChanged') {
          return Observable.never();
        }
        if (key === 'spaceDeleted') {
          return Observable.of(mockSpace);
        }
        if (key === 'spaceUpdated') {
          return Observable.never();
        }
      });
      mockProfile.store.recentSpaces = [mockSpace];
      const spacesService: SpacesService = TestBed.get(SpacesService);
      let result: Observable<Space[]> = spacesService.recent;
      result.subscribe((r: Space[]) => {
        expect(r).toEqual([] as Space[]);
      });
      expect(profileService.silentSave).toHaveBeenCalledTimes(1);
    });

    it('should not remove any spaces from _recent if deleted space was not in _recent', () => {
      const profileService: any = TestBed.get(ProfileService);
      const broadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      const mockSpace2: Space = {
        name: 'mock-space-name-2',
        path: 'mock-space-path-2' as String,
        id: 'mock-space-id-2',
        attributes: {
          name: 'mock-space-name-2',
          description: 'mock-space-description-2'
        }
      } as Space;
      broadcaster.on.and.callFake((key: string): Observable<Space> => {
        if (key === 'spaceChanged') {
          return Observable.never();
        }
        if (key === 'spaceDeleted') {
          return Observable.of(mockSpace2);
        }
        if (key === 'spaceUpdated') {
          return Observable.never();
        }
      });
      mockProfile.store.recentSpaces = [mockSpace];
      const spacesService: SpacesService = TestBed.get(SpacesService);
      let result: Observable<Space[]> = spacesService.recent;
      result.subscribe((r: Space[]) => {
        expect(r).toEqual([mockSpace] as Space[]);
      });
      expect(profileService.silentSave).toHaveBeenCalledTimes(0);
    });
  });

});
