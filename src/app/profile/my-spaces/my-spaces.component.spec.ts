import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ErrorHandler, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { Broadcaster, Logger } from 'ngx-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Context, Contexts, Space, SpaceService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { Filter, SortEvent, SortField } from 'patternfly-ng';
import { Action } from 'patternfly-ng/action';
import {
  ConnectableObservable,
  Observable,
  of,
  throwError as observableThrowError
} from 'rxjs';
import { createMock } from 'testing/mock';
import { initContext, TestContext } from 'testing/test-context';
import { ExtProfile, GettingStartedService } from '../../getting-started/services/getting-started.service';
import { spaceMock } from '../../shared/context.service.mock';
import { UserSpacesService } from '../../shared/user-spaces.service';
import { SpacesType } from './my-spaces-toolbar/my-spaces-toolbar.component';
import { MySpacesComponent } from './my-spaces.component';

@Component({
  template: '<alm-my-spaces></alm-my-spaces>'
})
class HostComponent { }

describe('MySpacesComponent', (): void => {

  type TestingContext = TestContext<MySpacesComponent, HostComponent>;
  const mockModalRef: jasmine.SpyObj<BsModalRef> = jasmine.createSpyObj('BsModalRef', ['hide']);
  const mockTemplateRef: jasmine.SpyObj<TemplateRef<any>> = jasmine.createSpyObj('TemplateRef', ['elementRef', 'createEmbeddedView']);
  let mockExtProfile: ExtProfile;
  let mockUser: User;
  let mockContext: Context;
  let spaceMock1: Space;
  let spaceMock2: Space;
  let spaceMock3: Space;

  let mockFilter1: Filter = {
    field: { id: 'name' },
    value: 'space'
  };

  let mockFilter2: Filter = {
    field: { id: 'name' },
    value: '2'
  };

  let mockFilter3: Filter = {
    field: { id: 'not-name' },
    value: 'zzz'
};

  beforeEach((): void => {
    mockExtProfile = {
      bio: 'mock-bio',
      company: 'mock-company',
      email: 'mock-email',
      emailPrivate: false,
      fullName: 'mock-fullName',
      imageURL: 'mock-imageUrl',
      url: 'mock-url',
      username: 'mock-username',
      contextInformation: {
        pins: {
          'myspaces': []
        }
      },
      registrationCompleted: true,
      featureLevel: 'mock-featureLevel'
    } as ExtProfile;

    mockUser = {
      attributes: mockExtProfile,
      id: 'mock-id',
      type: 'mock-type'
    } as User;

    mockContext = {
      user: mockUser,
      type: jasmine.createSpy('ContextType'),
      path: 'mock-path',
      name: 'mock-name'
    } as Context;
    spaceMock1 = cloneDeep(spaceMock); // owned space
    spaceMock2 = cloneDeep(spaceMock); // owned space
    spaceMock3 = cloneDeep(spaceMock); // collaborating space
    (spaceMock1 as any).showPin = true;
    spaceMock2.id = '2';
    (spaceMock2 as any).showPin = false;
    spaceMock2.attributes.name = 'spaceMock2-name';
    spaceMock3.id = '3';
    spaceMock3.attributes.name = 'spaceMock3-name';
  });

  const testContext: TestingContext = initContext(MySpacesComponent, HostComponent, {
    imports: [FormsModule, HttpClientTestingModule],
    declarations: [MySpacesComponent],
    providers: [
      {
        provide: Contexts,
        useFactory: (): jasmine.SpyObj<Contexts> => {
          const mockContexts: jasmine.SpyObj<Contexts> = createMock(Contexts);
          mockContexts.current = of(mockContext) as Observable<Context> & jasmine.Spy;
          return mockContexts;
        }
      },
      {
        provide: GettingStartedService,
        useFactory: (): jasmine.SpyObj<GettingStartedService> => {
          const mockGettingStartedService: jasmine.SpyObj<GettingStartedService> = createMock(GettingStartedService);
          mockGettingStartedService.createTransientProfile.and.returnValue(mockExtProfile);
          mockGettingStartedService.update.and.returnValue(of({}));
          return mockGettingStartedService;
        }
      },
      {
        provide: Logger,
        useFactory: (): jasmine.SpyObj<Logger> => {
          const mockLogger: jasmine.SpyObj<Logger> = createMock(Logger);
          mockLogger.error.and.stub();
          return mockLogger;
        }
      },
      {
        provide: Broadcaster,
        useFactory: (): jasmine.SpyObj<Broadcaster> => {
          const mockBroadcaster: jasmine.SpyObj<Broadcaster> = createMock(Broadcaster);
          mockBroadcaster.on.and.stub();
          mockBroadcaster.broadcast.and.callThrough();
          return mockBroadcaster;
        }
      },
      {
        provide: BsModalService,
        useFactory: (): jasmine.SpyObj<BsModalService> => {
          const mockBsModalService: jasmine.SpyObj<BsModalService> = createMock(BsModalService);
          mockBsModalService.show.and.returnValue(mockModalRef);
          return mockBsModalService;
        }
      },
      {
        provide: SpaceService,
        useFactory: (): jasmine.SpyObj<SpaceService> => {
          const mockSpaceService: any = createMock(SpaceService);
          mockSpaceService.getSpacesByUser.and.returnValue(of([spaceMock1, spaceMock2]));
          mockSpaceService.getSpaceById.and.returnValue(of([spaceMock3]));
          mockSpaceService.deleteSpace.and.stub();
          return mockSpaceService;
        }
      },
      {
        provide: UserService,
        useFactory: (): jasmine.SpyObj<UserService> => {
          const mockUserService: jasmine.SpyObj<UserService> = createMock(UserService);
          mockUserService.loggedInUser = of(mockUser) as ConnectableObservable<User> & jasmine.Spy;
          return mockUserService;
        }
      },
      {
        provide: ErrorHandler,
        useFactory: (): jasmine.SpyObj<ErrorHandler> => {
          const mockErrorHandler: jasmine.SpyObj<ErrorHandler> = createMock(ErrorHandler);
          mockErrorHandler.handleError.and.callThrough();
          return mockErrorHandler;
        }
      },
      {
        provide: UserSpacesService,
        useFactory: (): jasmine.SpyObj<UserSpacesService> => {
          const mockUserSpacesService: jasmine.SpyObj<UserSpacesService> = createMock(UserSpacesService);
          mockUserSpacesService.getSharedSpaces.and.returnValue(of([spaceMock3]));
          mockUserSpacesService.getInvolvedSpacesCount.and.returnValue(of([3]));
          return mockUserSpacesService;
        }
      }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  });

  describe('#spaces', (): void => {
    it('should return the contents of displayedSpaces', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const result: Space[] = component.spaces;
      expect(result).toEqual([spaceMock1, spaceMock2]);
    });

    it('should toggle to show Shared Spaces', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      component.toggleChange(SpacesType.SHAREDSPACES);
      expect(component.spaces).toEqual([spaceMock3]);
    });
  });

  /**
   * Events
   */
  describe('#handlePinChange', (): void => {
    it('should delegate to savePins and updateSpaces if the selected space exists in the user\'s spaces', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      spyOn(component, 'savePins').and.callThrough();
      spyOn(component, 'updateSpaces');
      component.handlePinChange(spaceMock1);
      expect(component.savePins).toHaveBeenCalled();
      expect(component.updateSpaces).toHaveBeenCalled();
    });

    it('should not adjust the pins if the space does not exist in the user\'s spaces', () => {
      const component: MySpacesComponent = testContext.testedDirective;
      spyOn(component, 'savePins');
      component.handlePinChange(spaceMock3);
      expect(component.savePins).toHaveBeenCalledTimes(0);
    });

    it('should toggle the pin state', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      spyOn(component, 'savePins').and.callThrough();
      spyOn(component, 'updateSpaces');
      component.handlePinChange(spaceMock2);
      expect((component.spaces[1] as any).showPin).toBe(true);
    });
  });

  describe('#handleCreateSpaceAction', (): void => {
    it('should broadcast event when create space is clicked', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const mockBroadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      component.handleAction({ id: 'createSpace'} as Action);
      expect(mockBroadcaster.broadcast).toHaveBeenCalledWith('showAddSpaceOverlay', true);
    });
  });

  /**
   * Filter
   */

  describe('#applyFilters', (): void => {
    it('should use matchesFilters to select qualifying spaces', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      spyOn(component, 'matchesFilters');
      component.filterChange({ appliedFilters: [mockFilter1, mockFilter2] });
      component.applyFilters();
      expect(component.matchesFilters).toHaveBeenCalled();
    });

    it('should return all spaces if there are no filters', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      component.filterChange({ appliedFilters: [] });
      component.applyFilters();
      expect(component.spaces).toEqual([spaceMock1, spaceMock2]);
    });
  });

  describe('#matchesFilter', (): void => {
    it('should return true if there is a space that matches the filter value', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const result: boolean = component.matchesFilter(spaceMock1, mockFilter1);
      expect(result).toBe(true);
    });

    it('should return false if there is no space that matches the filter value', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const result: boolean = component.matchesFilter(spaceMock1, mockFilter2);
      expect(result).toBe(false);
    });

    it('should simply return true if the filter id isn\'t name, because this is not supported functionality', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const result: boolean = component.matchesFilter(spaceMock1, mockFilter3);
      expect(result).toBe(true);
    });

    it('should be case-insensitive', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const mockFilterCaseInsensitive: Filter = cloneDeep(mockFilter1);
      mockFilterCaseInsensitive.value = mockFilter1.value.toUpperCase();
      const result: boolean = component.matchesFilter(spaceMock1, mockFilterCaseInsensitive);
      expect(result).toBe(true);
    });
  });

  describe('#matchesFilters', (): void => {
    it('should delegate to the matchesFilter method for each filter', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      let mockFilters: Filter[] = [mockFilter1, mockFilter2];
      spyOn(component, 'matchesFilter');
      component.matchesFilters(spaceMock1, mockFilters);
      expect(component.matchesFilter).toHaveBeenCalledTimes(2);
    });

    it('should return true if all of the filters are satisfied', () => {
      const component: MySpacesComponent = testContext.testedDirective;
      let mockFilters: Filter[] = [mockFilter1, mockFilter3];
      const result: boolean = component.matchesFilters(spaceMock2, mockFilters);
      expect(result).toBe(true);
    });

    it('should return false if at least one of the filters results in zero matches', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      let mockFilters: Filter[] = [mockFilter1, mockFilter2, mockFilter3];
      const result: boolean = component.matchesFilters(spaceMock1, mockFilters);
      expect(result).toBe(false);
    });
  });

  /**
   * Spaces
   */

  describe('#canDeleteSpace', (): void => {
    it('should be true if the creator and user are the same people', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const result: boolean = component.canDeleteSpace('mock-id');
      expect(result).toBe(true);
    });

    it('should be false if the creator and user are different people', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const result: boolean = component.canDeleteSpace('not-mock-id');
      expect(result).toBe(false);
    });
  });

  describe('#confirmDeleteSpace', (): void => {
    it('should show the modal to confirm deletion of the space', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const mockBsModalService: jasmine.SpyObj<BsModalService> = TestBed.get(BsModalService);
      component.confirmDeleteSpace(spaceMock1, mockTemplateRef);
      expect(mockBsModalService.show).toHaveBeenCalled();
    });
  });

  describe('#initSpaces', (): void => {
    it('should retrieve the user\'s space information and show all spaces', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      component.initSpaces();
      expect(component.spaces).toEqual([spaceMock1, spaceMock2]);
    });
  });

  describe('#removeSpace', (): void => {
    it('should delegate to spaceService.deleteSpace for deletion', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const mockSpaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spyOn(mockSpaceService, 'deleteSpace').and.returnValue(of(spaceMock1));
      component.confirmDeleteSpace(spaceMock1, mockTemplateRef);
      component.removeSpace();
      expect(mockSpaceService.deleteSpace).toHaveBeenCalledWith(spaceMock1);
    });

    it('should remove the selected space out of _spaces', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const mockSpaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spyOn(mockSpaceService, 'deleteSpace').and.returnValue(of(spaceMock1));
      spyOn(component, 'savePins').and.callThrough();
      component.confirmDeleteSpace(spaceMock1, mockTemplateRef);
      expect(component.spaces).toEqual([spaceMock1, spaceMock2]);
      component.removeSpace();
      expect(component.spaces).toEqual([spaceMock2]);
    });

    it('should log an error if spaceService.deleteSpace fails', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const mockLogger: jasmine.SpyObj<Logger> = TestBed.get(Logger);
      const mockSpaceService: jasmine.SpyObj<SpaceService> = TestBed.get(SpaceService);
      spyOn(mockSpaceService, 'deleteSpace').and.returnValue(observableThrowError('error'));
      component.confirmDeleteSpace(spaceMock1, mockTemplateRef);
      component.removeSpace();
      expect(mockLogger.error).toHaveBeenCalledWith('error');
    });

    it('should log an error if there is no space to delete', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const mockLogger: jasmine.SpyObj<Logger> = TestBed.get(Logger);
      component.removeSpace();
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('#updateSpaces', (): void => {
    it('should apply filters and sort', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      spyOn(component, 'applyFilters');
      spyOn(component, 'sort');
      component.updateSpaces();
      expect(component.applyFilters).toHaveBeenCalled();
      expect(component.sort).toHaveBeenCalled();
    });
  });

  /**
   * Sort
   */

  describe('#compare', (): void => {
    it('should return 0 (no difference) if the spaces are the same, sorted ascending', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const mockSortEvent: SortEvent = {
        field: {
          id: 'name',
          sortType: 'mock-sortType'
        } as SortField,
        isAscending: true
      };
      component.sortChange(mockSortEvent);
      const result: number = component.compare(spaceMock1, spaceMock1);
      expect(result).toBe(0);
    });

    it('should return 0 (no difference) if the spaces are the same, sorted descending', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const mockSortEvent: SortEvent = {
        field: {
          id: 'name',
          sortType: 'mock-sortType'
        } as SortField,
        isAscending: false
      };
      component.sortChange(mockSortEvent);
      const result: number = component.compare(spaceMock1, spaceMock1);
      expect(result).toBe(0);
    });

    it('should return -1 if the first space is first alphabetically, sorted ascending', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const result: number = component.compare(spaceMock1, spaceMock2);
      expect(result).toBe(-1);
    });

    it('should return 1 if the first space is first alphabetically, sorted descending', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const mockSortEvent: SortEvent = {
        field: {
          id: 'name',
          sortType: 'mock-sortType'
        } as SortField,
        isAscending: false
      };
      component.sortChange(mockSortEvent);
      const result: number = component.compare(spaceMock1, spaceMock2);
      expect(result).toBe(1);
    });

    it('should simply return 0 if currentSortField is undefined', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      let mockSortEvent: SortEvent = {
        field: {} as SortField,
        isAscending: false
      };
      component.sortChange(mockSortEvent);
      const result: number = component.compare(spaceMock1, spaceMock2);
      expect(result).toBe(0);
    });
  });

  describe('#sort', (): void => {
    it('should use the value from compare() to sort the spaces', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      spyOn(component, 'compare');
      component.sort();
      expect(component.compare).toHaveBeenCalled();
    });

    it('should sort the spaces in-place', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const mockSortEvent: SortEvent = {
        field: {
          id: 'name',
          sortType: 'mock-sortType'
        } as SortField,
        isAscending: false
      };
      component.sortChange(mockSortEvent);
      component.sort();
      expect(component.spaces).toEqual([spaceMock2, spaceMock1]);
    });
  });

  describe('#sortChange', (): void => {
    it ('should update the spaces', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      spyOn(component, 'updateSpaces');
      const mockSortEvent: SortEvent = {
        field: {} as SortField,
        isAscending: false
      };
      component.sortChange(mockSortEvent);
      expect(component.updateSpaces).toHaveBeenCalled();
    });
  });

  /**
   * Wizard
   */

  describe('#showAddSpaceOverlay', (): void => {
    it('should broadcast an event to open the new Space overlay', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const mockBroadcaster: jasmine.SpyObj<Broadcaster> = TestBed.get(Broadcaster);
      component.showAddSpaceOverlay();
      expect(mockBroadcaster.broadcast).toHaveBeenCalledWith('showAddSpaceOverlay', true);
    });
  });

  /**
   * Pinned Items
   */

  describe('#restorePins', (): void => {
    it('should appropriately show pins for pinned spaces based on contextInformation', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      component.restorePins();
      expect((component.spaces[0] as any).showPin).toBe(false);
      expect((component.spaces[1] as any).showPin).toBe(false);
    });
  });


  describe('#savePins', (): void => {
    it('should initialize the contextInformation and pins if undefined', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      mockExtProfile.contextInformation = undefined;
      component.savePins();
      expect(mockExtProfile.contextInformation).toBeDefined();
      expect(mockExtProfile.contextInformation.pins).toBeDefined();
    });

    it('should update the profile via GettingStartedService update()', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const mockGettingStartedService: jasmine.SpyObj<GettingStartedService> = TestBed.get(GettingStartedService);
      component.savePins();
      expect(mockGettingStartedService.update).toHaveBeenCalled();
    });

    it('should log an error if there was a problem with subscribing to the update', (): void => {
      const component: MySpacesComponent = testContext.testedDirective;
      const mockGettingStartedService: jasmine.SpyObj<GettingStartedService> = TestBed.get(GettingStartedService);
      const mockLogger: jasmine.SpyObj<Logger> = TestBed.get(Logger);
      mockGettingStartedService.update.and.returnValue(observableThrowError('error'));
      component.savePins();
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
