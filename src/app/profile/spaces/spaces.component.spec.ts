import { DebugNode, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Broadcaster, Logger } from 'ngx-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Contexts, Fabric8WitModule, Space, SpaceService } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { EventService } from '../../shared/event.service';
import { SpaceWizardComponent } from '../../space/wizard/space-wizard.component';
import { SpacesComponent } from './spaces.component';


describe('SpacesComponent', () => {

  let fixture: ComponentFixture<SpacesComponent>;
  let component: DebugNode['componentInstance'];
  let mockRouter: any = jasmine.createSpy('Router');
  let mockSpaceService: any = jasmine.createSpy('SpaceService');
  let mockLogger: any = jasmine.createSpyObj('Logger', ['error']);
  let mockContexts: any = jasmine.createSpy('Contexts');
  let mockEventService: any = jasmine.createSpy('EventService');
  let mockBsModalService: any = jasmine.createSpyObj('BsModalService', ['show']);
  let mockAuthenticationService: any = jasmine.createSpyObj('AuthenticationService', ['getToken']);
  let mockBroadcaster: any = jasmine.createSpyObj('Broadcaster', ['broadcast']);
  let mockModalRef: any = jasmine.createSpyObj('BsModalRef', ['hide']);
  let mockEvent = jasmine.createSpy('Event');

  mockAuthenticationService.getGitHubToken = {};
  mockContexts.current = Observable.of({
    'user': {
      'attributes': {
        'username': 'mock-username'
      },
      'id': 'mock-user'
    }
  });
  mockEventService.deleteSpaceSubject = new Subject<String>();
  mockSpaceService.deleteSpace = {};
  mockSpaceService.getSpacesByUser = {};
  mockSpaceService.getMoreSpacesByUser = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Fabric8WitModule],
      declarations: [SpacesComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SpaceService, useValue: mockSpaceService },
        { provide: Logger, useValue: mockLogger },
        { provide: Contexts, useValue: mockContexts },
        { provide: EventService, useValue: mockEventService },
        { provide: BsModalService, useValue: mockBsModalService },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: Broadcaster, useValue: mockBroadcaster }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(SpacesComponent);
    component = fixture.debugElement.componentInstance;
  });

  describe('#initSpaces', () => {
    it('should use spaceService.getSpacesByUser to set the initial spaces', () => {
      spyOn(component.spaceService, 'getSpacesByUser').and.returnValue(Observable.of('mock-spaces'));
      component.initSpaces(mockEvent);
      expect(component._spaces).toBe('mock-spaces');
    });

    it('should log an error if the context or context.user is empty', () => {
      component.context = {};
      component.initSpaces(mockEvent);
      expect(component.logger.error).toHaveBeenCalled();
    });
  });

  describe('#fetchMoreSpaces', () => {
    it('should retrieve more spaces and add them to the current list', () => {
      spyOn(component.spaceService, 'getMoreSpacesByUser').and.returnValue(Observable.of('more-spaces'));
      component.fetchMoreSpaces(mockEvent);
      expect(component._spaces).toContain('more-spaces');
    });

    it('should report an error if getMoreSpaces() has an Observable error', () => {
      spyOn(component.spaceService, 'getMoreSpacesByUser').and.returnValue(Observable.throw('error'));
      component.fetchMoreSpaces(mockEvent);
      expect(component.logger.error).toHaveBeenCalledWith('error');
    });

    it('should log an error if the context or context.user is empty', () => {
      component.context = {};
      component.fetchMoreSpaces(mockEvent);
      expect(component.logger.error).toHaveBeenCalled();
    });
  });

  describe('#removeSpace', () => {
    it('should remove the space if the conditions are met', () => {
      let mockSpaces = ['mock-space1', 'mock-space2'];
      let mockSpacesObservable = Observable.of(mockSpaces);
      component.spaceToDelete = 'mock-space1'; // want to remove mock-space1 from _spaces
      component.modalRef = mockModalRef;

      // initialize component._spaces
      spyOn(component.spaceService, 'getSpacesByUser').and.returnValue(mockSpacesObservable);
      component.initSpaces(mockEvent);
      expect(component._spaces).toBe(mockSpaces);

      spyOn(component.spaceService, 'deleteSpace').and.returnValue(mockSpacesObservable);
      component.removeSpace();
      expect(component._spaces).toEqual(['mock-space2']);
      expect(component.modalRef.hide).toHaveBeenCalled();
    });

    it('should log an error if the SpaceService.deleteSpace observable throws an error', () => {
      let error = 'error';
      component.spaceToDelete = 'mock-spaceToDelete';
      component.modalRef = mockModalRef;
      spyOn(component.spaceService, 'deleteSpace').and.returnValue(Observable.throw(error));
      component.removeSpace();
      expect(component.logger.error).toHaveBeenCalledWith(error);
      expect(component.modalRef.hide).toHaveBeenCalled();
    });

    it('show log an error if it cannot retrieve a list of the user\'s spaces', () => {
      let errorString = 'Failed to retrieve list of spaces owned by user';
      component.context = {};
      component.removeSpace();
      expect(component.logger.error).toHaveBeenCalledWith(errorString);
    });
  });

  describe('#canDeleteSpace', () => {
    it('should allow deletion only if the creator and user are the same person', () => {
      let result: boolean = component.canDeleteSpace('mock-user');
      expect(result).toBeTruthy();
    });

    it('should reject deletion if the creator and user are different people', () => {
      let result: boolean = component.canDeleteSpace('not-mock-user');
      expect(result).toBeFalsy();
    });
  });

  describe('#spaces', () => {
    it('should return the contents of _space', () => {
      let mockSpace = ['mock-space1', 'mock-space2'];
      spyOn(component.spaceService, 'getSpacesByUser').and.returnValue(Observable.of(mockSpace));
      component.initSpaces(mockSpace);
      let result = component.spaces;
      expect(result).toBe(mockSpace);
    });
  });

  describe('#searchSpaces', () => {
    it('should push the searchText value onto the searchTermStream subject', () => {
      let mockSearchText = 'mock-text';
      spyOn(component.searchTermStream, 'next');
      component.searchSpaces(mockSearchText);
      expect(component.searchTermStream.next).toHaveBeenCalledWith(mockSearchText);
    });
  });

  describe('#openForgeWizard', () => {
    it('should show the modal if there exists a GitHub token for the user', () => {
      let addSpace = jasmine.createSpy('TemplateRef');
      spyOn(component.authentication, 'getGitHubToken').and.returnValue('mock-token');
      component.openForgeWizard(addSpace);
      expect(component.selectedFlow).toBe('start');
      expect(component.modalService.show).toHaveBeenCalled();
    });

    it('should broadcast an event indicating a disconnection from GitHub if no token', () => {
      let addSpace = jasmine.createSpy('TemplateRef');
      spyOn(component.authentication, 'getGitHubToken').and.returnValue('');
      component.openForgeWizard(addSpace);
      expect(component.broadcaster.broadcast).toHaveBeenCalled();
    });
  });

  describe('#closeModal', () => {
    it('should hide the modal', () => {
      component.modalRef = mockModalRef;
      component.cancel(mockEvent);
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });

  describe('#cancel', () => {
    it('should hide the modal', () => {
      component.modalRef = mockModalRef;
      component.cancel();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });

  describe('#selectFlow', () => {
    it('should set the flow and space from the passed $event', () => {
      let mockEvent = {
        'flow': 'mock-flow',
        'space': 'mock-space'
      };
      component.selectFlow(mockEvent);
      expect(component.selectedFlow).toBe('mock-flow');
      expect(component.space).toBe('mock-space');
    });
  });

});
