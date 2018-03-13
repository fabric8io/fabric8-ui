import { DebugNode, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { cloneDeep } from 'lodash';
import { Logger } from 'ngx-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Context, Contexts, Space, SpaceService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';

import { ExtProfile, GettingStartedService } from '../../getting-started/services/getting-started.service';
import { spaceMock } from '../../shared/context.service.mock';
import { EventService } from '../../shared/event.service';
import { MySpacesComponent } from './my-spaces.component';


describe('MySpacesComponent', () => {

  let fixture: ComponentFixture<MySpacesComponent>;
  let component: DebugNode['componentInstance'];
  let mockContexts: any = jasmine.createSpy('Contexts');
  let mockEventService: any = jasmine.createSpy('EventService');
  let mockGettingStartedService: any = jasmine.createSpyObj('GettingStartedService', ['createTransientProfile', 'update']);
  let mockLogger: any = jasmine.createSpyObj('Logger', ['error']);
  let mockBsModalService: any = jasmine.createSpyObj('BsModalService', ['show']);
  let mockSpaceService: any = jasmine.createSpyObj('SpaceService', ['getSpacesByUser']);
  let mockUserService: any = jasmine.createSpy('UserService');
  let mockModalRef: any = jasmine.createSpyObj('BsModalRef', ['hide']);
  let mockTemplateRef = jasmine.createSpy('TemplateRef');
  let mockUser: User;
  let mockExtProfile: ExtProfile;
  let mockContext: Context;
  let spaceMock1: any;
  let spaceMock2: any;
  let mockEvent: any = {
    'flow': 'mock-flow',
    'space': 'mock-space'
  };

  let mockFilterEvent: any = {
    'appliedFilters': 'mock-applied-filters'
  };

  let mockSortEvent: any = {
    field: 'mock-field',
    isAscending: true
  };

  let mockFilter1: any = {
    field: { id: 'name' },
    value: 'space'
  };

  let mockFilter2: any = {
    field: { id: 'name' },
    value: '2'
  };

  let mockFilter3: any = {
    field: { id: 'not-name' },
    value: 'zzz'
  };

  mockSpaceService.deleteSpace = {};
  mockEventService.deleteSpaceSubject = jasmine.createSpyObj('deleteSpaceSubject', ['next']);

  beforeEach(() => {

    mockExtProfile = {
        'bio': 'mock-bio',
        'company': 'mock-company',
        'email': 'mock-email',
        'emailPrivate': false,
        'fullName': 'mock-fullName',
        'imageURL': 'mock-imageUrl',
        'url': 'mock-url',
        'username': 'mock-username',
        'contextInformation': undefined,
        'registrationCompleted': true,
        'featureLevel': 'mock-featureLevel'
    };
    mockUser = {
      'attributes': mockExtProfile,
      'id': 'mock-id',
      'type': 'mock-type'
    };
    mockContext = {
      user: mockUser,
      type: jasmine.createSpy('ContextType'),
      path: 'mock-path',
      name: 'mock-name'
    };
    spaceMock1 = cloneDeep(spaceMock);
    spaceMock2 = cloneDeep(spaceMock);
    spaceMock2.id = '2';
    spaceMock2.attributes.name = 'spaceMock2-id';
    mockContexts.current = Observable.of(mockContext);
    mockUserService.loggedInUser = Observable.of(mockUser);
    mockGettingStartedService.createTransientProfile.and.returnValue(mockExtProfile);
    mockGettingStartedService.update.and.returnValue(Observable.of({}));
    mockSpaceService.getSpacesByUser.and.returnValue(Observable.of([spaceMock1, spaceMock2])); // called by ngOnInit() to initialize allSpaces

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MySpacesComponent],
      providers: [
        { provide: Contexts, useValue: mockContexts },
        { provide: EventService, useValue: mockEventService },
        { provide: GettingStartedService, useValue: mockGettingStartedService },
        { provide: Logger, useValue: mockLogger },
        { provide: BsModalService, useValue: mockBsModalService },
        { provide: SpaceService, useValue: mockSpaceService },
        { provide: UserService, useValue: mockUserService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(MySpacesComponent);
    component = fixture.debugElement.componentInstance;
  });

  /**
   * Accessors
   */

  describe('#spaces', () => {
    it('should return the contents of _spaces', () => {
      component.appliedFilters = [];
      component.ngOnInit();
      component.applyFilters(); // initialize _spaces first using applyFilters()
      let result = component.spaces;
      expect(result).toEqual([spaceMock1, spaceMock2]);
    });
  });

  /**
   * Events
   */

  describe('#handleAction', () => {
    it('should delegate to the forge wizard if the action is to create a space', () => {
      let mockAction = { id: 'createSpace' };
      spyOn(component, 'openForgeWizard');
      component.handleAction(mockAction);
      expect(component.openForgeWizard).toHaveBeenCalled();
    });

    it('should do nothing if the action is not createSpace', () => {
      let mockAction = { id: 'not-createSpace' };
      spyOn(component, 'openForgeWizard');
      component.handleAction(mockAction);
      expect(component.openForgeWizard).toHaveBeenCalledTimes(0);
    });
  });

  describe('#handlePinChange', () => {
    it('should delegate to savePins and updateSpaces if the selected space exists in the user\'s spaces', () => {
      spyOn(component, 'savePins').and.callFake(() => {});
      spyOn(component, 'updateSpaces');
      component.allSpaces = [ spaceMock1 ];
      component.handlePinChange(spaceMock1);
      expect(component.savePins).toHaveBeenCalled();
      expect(component.updateSpaces).toHaveBeenCalled();
    });

    it('should not adjust the pins if the space does not exist in the user\'s spaces', () => {
      spyOn(component, 'savePins');
      component.allSpaces = [];
      component.handlePinChange(spaceMock1);
      expect(component.savePins).toHaveBeenCalledTimes(0);
    });

    it('should show the pin for the space if pinned', () => {
      spyOn(component, 'savePins').and.callFake(() => {});
      spyOn(component, 'updateSpaces');
      spaceMock1.showPin = false;
      component.allSpaces = [spaceMock1];
      component.handlePinChange(spaceMock1);
      expect(spaceMock1.showPin).toBeDefined();
      expect(spaceMock1.showPin).toBeTruthy();
    });

    it('should remove the pin from the space if unpinned', () => {
      spyOn(component, 'savePins').and.callFake(() => {});
      spyOn(component, 'updateSpaces');
      spaceMock1.showPin = true;
      component.allSpaces = [ spaceMock1 ];
      component.handlePinChange(spaceMock1);
      expect(spaceMock1.showPin).toBeDefined();
      expect(spaceMock1.showPin).toBeFalsy();
    });
  });

  /**
   * Filter
   */

  describe('#applyFilters', () => {
    it('should use matchesFilters to select qualifying spaces', () => {
      component.appliedFilters = [mockFilter1, mockFilter2]; // 'space' && '2'
      component.ngOnInit();
      component.applyFilters();
      expect(component._spaces).toEqual([spaceMock2]);
    });

    it('should return all spaces if there are no filters', () => {
      component.appliedFilters = [];
      component.ngOnInit();
      component.applyFilters();
      expect(component._spaces).toEqual([spaceMock1, spaceMock2]);
    });
  });

  describe('#matchesFilter', () => {
    it('should return true if there is a space that matches the filter value', () => {
      let result: boolean = component.matchesFilter(spaceMock1, mockFilter1);
      expect(result).toBeTruthy();
    });

    it('should return false if there is no space that matches the filter value', () => {
      let result: boolean = component.matchesFilter(spaceMock1, mockFilter2);
      expect(result).toBeFalsy();
    });

    it('should simply return true if the filter id isn\'t name, because this is not supported functionality', () => {
      let result: boolean = component.matchesFilter(spaceMock1, mockFilter3);
      expect(result).toBeTruthy();
    });
  });

  describe('#matchesFilters', () => {
    it('should delegate to the matchesFilter method for each filter', () => {
      let mockFilters = [mockFilter1, mockFilter2];
      spyOn(component, 'matchesFilter');
      let result = component.matchesFilters(spaceMock1, mockFilters);
      expect(component.matchesFilter).toHaveBeenCalledTimes(2);
    });

    it('should return true if all of the filters are satisfied', () => {
      let mockFilters = [mockFilter1, mockFilter2];
      let result = component.matchesFilters(spaceMock2, mockFilters);
      expect(result).toBeTruthy();
    });

    it('should return false if at least one of the filters results in zero matches', () => {
      let mockFilters = [mockFilter1, mockFilter2, mockFilter3];
      let result = component.matchesFilters(spaceMock1, mockFilters);
      expect(result).toBeFalsy();
    });
  });

  describe('#filterChange', () => {
    it('should set the applied filters and update the spaces', () => {
      spyOn(component, 'updateSpaces');
      component.filterChange(mockFilterEvent);
      expect(component.appliedFilters).toBe('mock-applied-filters');
      expect(component.updateSpaces).toHaveBeenCalled();
    });
  });

  /**
   * Spaces
   */

  describe('#canDeleteSpace', () => {
    it('should be true if the creator and user are the same people', () => {
      let result = component.canDeleteSpace('mock-id');
      expect(result).toBeTruthy();
    });

    it('should be false if the creator and user are different people', () => {
      let result = component.canDeleteSpace('not-mock-id');
      expect(result).toBeFalsy();
    });
  });

  describe('#confirmDeleteSpace', () => {
    it('should indicate that the passed space is to be deleted', () => {
      component.confirmDeleteSpace(spaceMock1, mockTemplateRef);
      expect(component.spaceToDelete).toBe(spaceMock1);
    });

    it('should show the modal to confirm deletion of the space', () => {
      component.confirmDeleteSpace(spaceMock1, mockTemplateRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });

  describe('#initSpaces', () => {
    it('should log an error if it failed to retrieve a list of the user\'s spaces', () => {
      component.context = {};
      component.initSpaces(mockEvent);
      expect(component.logger.error).toHaveBeenCalled();
    });

    it('should retrieve the user\'s space information and show all spaces', () => {
      expect(component.showSpaces).toBeFalsy();
      component.initSpaces(mockEvent);
      expect(component.showSpaces).toBeTruthy();
      expect(component.allSpaces).toEqual([spaceMock1, spaceMock2]);
    });

    // crashes from uncaught error if spaceService.getSpacesByUser fails
    xit('should handle an error from spaceService.getSpacesByUser', () => {
      mockSpaceService.getSpacesByUser.and.returnValue(Observable.throw('error'));
      component.initSpaces(mockEvent);
      // crashes ..
    });
  });

  describe('#removeSpace', () => {
    it('should delegate to spaceService.deleteSpace for deletion', () => {
      spyOn(component.spaceService, 'deleteSpace').and.returnValue(Observable.of(spaceMock1));
      component.modalRef = mockModalRef;
      component.spaceToDelete = spaceMock1;
      component.ngOnInit();
      component.removeSpace();
      expect(component.spaceService.deleteSpace).toHaveBeenCalledWith(spaceMock1);
    });

    it('should remove the selected space out of allSpaces', () => {
      spyOn(component.spaceService, 'deleteSpace').and.returnValue(Observable.of(spaceMock1));
      spyOn(component, 'savePins').and.callThrough();
      component.modalRef = mockModalRef;
      component.spaceToDelete = spaceMock1;
      component.ngOnInit();
      expect(component.allSpaces).toEqual([spaceMock1, spaceMock2]);
      component.removeSpace();
      expect(component.allSpaces).toEqual([spaceMock2]);
    });

    it('should log an error if spaceService.deleteSpace fails', () => {
      spyOn(component.spaceService, 'deleteSpace').and.returnValue(Observable.throw('error'));
      component.modalRef = mockModalRef;
      component.spaceToDelete = spaceMock1;
      component.ngOnInit();
      component.removeSpace();
      expect(component.logger.error).toHaveBeenCalledWith('error');
    });

    it('should log an error if there is no space to delete', () => {
      component.ngOnInit();
      component.removeSpace();
      expect(component.logger.error).toHaveBeenCalled();
    });
  });

  describe('#updateSpaces', () => {
    it('should apply filters and sort', () => {
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

  describe('#compare', () => {
    it('should return 0 (no difference) if the spaces are the same, sorted ascending', () => {
      // run ngOnInit to initialize the component's currentSortField and isAscending attributes
      component.ngOnInit();
      component.isAscendingSort = true;
      let result: number = component.compare(spaceMock1, spaceMock1);
      expect(result).toBe(0);
    });

    it('should return 0 (no difference) if the spaces are the same, sorted descending', () => {
      // run ngOnInit to initialize the component's currentSortField and isAscending attributes
      component.ngOnInit();
      component.isAscendingSort = false;
      let result: number = component.compare(spaceMock1, spaceMock1);
      expect(result).toBe(0);
    });

    it('should return -1 if the first space is first alphabetically, sorted ascending', () => {
      component.isAscendingSort = true;
      // run ngOnInit to initialize the component's currentSortField and isAscending attributes
      component.ngOnInit();
      let result: number = component.compare(spaceMock1, spaceMock2);
      expect(result).toBe(-1);
    });

    it('should return 1 if the first space is first alphabetically, sorted descending', () => {
      // run ngOnInit to initialize the component's currentSortField and isAscending attributes
      component.ngOnInit();
      component.isAscendingSort = false;
      let result: number = component.compare(spaceMock1, spaceMock2);
      expect(result).toBe(1);
    });

    it('should simply return 0 if currentSortField is undefined', () => {
      let result: number = component.compare(spaceMock1, spaceMock2);
      expect(result).toBe(0);
    });
  });

  describe('#sort', () => {
    it('should use the value from compare() to sort the spaces', () => {
      spyOn(component, 'compare');
      component.appliedFilters = [];
      component.ngOnInit();
      component.applyFilters(); // initialize _spaces first using applyFilters()
      component.sort();
      expect(component.compare).toHaveBeenCalled();
    });

    it('should sort the spaces in-place using the array sort function', () => {
      spyOn(Array.prototype, 'sort').and.callThrough();
      component.appliedFilters = [];
      component.ngOnInit(); // run ngOnInit to initialize currentSortField
      component.isAscendingSort = false;
      component.applyFilters(); // initialize _spaces first using applyFilters()
      component.sort();
      expect(Array.prototype.sort).toHaveBeenCalled();
      expect(component._spaces).toEqual([spaceMock2, spaceMock1]);
    });
  });

  describe('#sortChange', () => {
    it('should update the current sort field & isAscending component attributes', () => {
      // run ngOnInit to initialize the component's currentSortField and isAscending attributes
      component.ngOnInit();
      component.sortChange(mockSortEvent);
      expect(component.currentSortField = 'mock-field');
      expect(component.isAscendingSort).toBeTruthy();
    });

    it ('should update the spaces', () => {
      spyOn(component, 'updateSpaces');
      component.sortChange(mockSortEvent);
      expect(component.updateSpaces).toHaveBeenCalled();
    });
  });

  /**
   * Wizard
   */

  describe('#closeModal', () => {
    it('should hide the modal', () => {
      component.modalRef = mockModalRef;
      component.closeModal(mockEvent);
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });

  describe('#openForgeWizard', () => {
    it('should open a large modal and set the flow to \'start\'', () => {
      let mockTemplateRef = jasmine.createSpy('TemplateRef');
      component.openForgeWizard(mockTemplateRef);
      expect(component.selectedFlow).toBe('start');
      expect(component.modalService.show).toHaveBeenCalledWith(mockTemplateRef, {class: 'modal-lg'});
    });
  });

  describe('#selectFlow', () => {
    it('should set the flow and space from the passed $event', () => {
      component.selectFlow(mockEvent);
      expect(component.selectedFlow).toBe(mockEvent.flow);
      expect(component.space).toBe(mockEvent.space);
    });
  });

  /**
   * Pinned Items
   */

  describe('#restorePins', () => {
    it('should set boolean on spaces to properly sort pins', () => {
      mockContext.user.attributes['contextInformation'] = {
        pins: {
          'myspaces': [] // no pins
        }
      };
      component.pageName = 'myspaces';
      component.allSpaces = [spaceMock1, spaceMock2];
      expect(spaceMock1.showPin).toBeUndefined();
      expect(spaceMock2.showPin).toBeUndefined();
      component.restorePins();
      expect(spaceMock1.showPin).toBeDefined();
      expect(spaceMock2.showPin).toBeDefined();
    });

    it('should not show any pins if the spaces are not pinned', () => {
      mockContext.user.attributes['contextInformation'] = {
        pins: {
          'myspaces': [] // no pins
        }
      };
      component.pageName = 'myspaces';
      component.ngOnInit();
      component.restorePins();
      expect(spaceMock1.showPin).toBeFalsy();
      expect(spaceMock2.showPin).toBeFalsy();
    });

    it('should appropriately show pins for pinned spaces', () => {
      mockContext.user.attributes['contextInformation'] = {
        pins: {
          'myspaces': [
            spaceMock1.id
          ]
        }
      };
      component.pageName = 'myspaces';
      component.ngOnInit();
      component.restorePins();
      expect(spaceMock1.showPin).toBeTruthy();
      expect(spaceMock2.showPin).toBeFalsy();
    });

    it('should return and do nothing if the user has no attributes', () => {
      component.loggedInUser.attributes = undefined;
      spyOn(component.allSpaces, 'forEach');
      component.restorePins();
      expect(component.allSpaces.forEach).toHaveBeenCalledTimes(0);
    });
  });

  describe('#savePins', () => {
    it('should initialize the contextInformation and pins if undefined', () => {
      expect(mockExtProfile.contextInformation).toBeUndefined();
      component.savePins();
      expect(mockExtProfile.contextInformation).toBeDefined();
      expect(mockExtProfile.contextInformation.pins).toBeDefined();
    });

    it('should save the pins that are currently showing', () => {
      spaceMock1.showPin = true;
      spaceMock2.showPin = false;
      mockContext.user.attributes['contextInformation'] = {
        pins: {
          'myspaces': [
            spaceMock1.id
          ]
        }
      };
      component.pageName = 'myspaces';
      mockGettingStartedService.update.and.returnValue(Observable.of(mockContext.user.attributes));
      component.ngOnInit();
      component.savePins();
      expect(mockExtProfile.contextInformation.pins['myspaces']).toEqual([spaceMock1.id]);
    });

    it('should update the profile via GettingStartedService update()', () => {
      component.savePins();
      expect(component.gettingStartedService.update).toHaveBeenCalled();
    });

    it('should log an error if there was a problem with subscribing to the update', () => {
      mockGettingStartedService.update.and.returnValue(Observable.throw('error'));
      component.savePins();
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

});
