import { DebugNode, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { Broadcaster, Logger } from 'ngx-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Contexts, Fabric8WitModule, SpaceService, WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';

import { SpacesComponent } from './spaces.component';


describe('SpacesComponent', () => {
  let fixture: ComponentFixture<SpacesComponent>;
  let component: DebugNode['componentInstance'];
  let mockContexts: any = jasmine.createSpy('Contexts');
  let mockLogger: any = jasmine.createSpyObj('Logger', ['error']);
  let mockSpaceService: any = jasmine.createSpy('SpaceService');
  let mockUserService: any = jasmine.createSpy('UserService');
  let mockModalService: any = jasmine.createSpyObj('BsModalService', ['show']);
  let mockModalRef: any = jasmine.createSpyObj('BsModalRef', ['hide']);
  let mockAuthenticationService: any = jasmine.createSpyObj('AuthenticationService', ['getGitHubToken', 'getToken']);
  let mockBroadcaster: any = jasmine.createSpyObj('Broadcaster', ['broadcast', 'on']);
  let mockEvent = jasmine.createSpy('Event');
  let mockContext: any;

  beforeEach(() => {
    mockBroadcaster.on.and.returnValue(Observable.of({}));
    mockContext = {
      'user': {
        'attributes': {
          'username': 'mock-username'
        },
        'id': 'mock-user'
      }
    };
    mockContexts.current = Observable.of(mockContext);
    mockAuthenticationService.gitHubToken = {};
    mockSpaceService.deleteSpace = {};
    mockSpaceService.getSpacesByUser = {};
    mockSpaceService.getMoreSpacesByUser = {};

    TestBed.configureTestingModule({
      imports: [
        Fabric8WitModule,
        HttpModule
      ],
      declarations: [SpacesComponent],
      providers: [
        { provide: Contexts, useValue: mockContexts },
        { provide: Logger, useValue: mockLogger },
        { provide: SpaceService, useValue: mockSpaceService },
        { provide: UserService, useValue: mockUserService},
        { provide: BsModalService, useValue: mockModalService },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: Broadcaster, useValue: mockBroadcaster },
        { provide: WIT_API_URL, useValue: 'http://example.com' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(SpacesComponent);
    component = fixture.debugElement.componentInstance;
  });

  describe('#ngOnInit', () => {
    it('should simply delegate to initSpaces() with the page size', () => {
      component.pageSize = 5;
      spyOn(component, 'initSpaces');
      component.ngOnInit();
      expect(component.initSpaces).toHaveBeenCalledWith({pageSize: 5});
    });
  });

  describe('#initSpaces', () => {
    it('should use spaceService.getSpacesByUser to set the initial spaces', () => {
      component.context = mockContext;
      spyOn(component.spaceService, 'getSpacesByUser').and.returnValue(Observable.of('mock-spaces'));
      component.initSpaces(mockEvent);
      expect(component.spaces).toBe('mock-spaces');
    });

    it('should log an error if the context or context.user is empty', () => {
      component.context = {};
      component.initSpaces(mockEvent);
      expect(component.logger.error).toHaveBeenCalled();
    });
  });

  describe('#fetchMoreSpaces', () => {
    it('should retrieve more spaces and add them to the current list', () => {
      component.context = mockContext;
      spyOn(component.spaceService, 'getMoreSpacesByUser').and.returnValue(Observable.of(['more-spaces']));
      component.fetchMoreSpaces(mockEvent);
      expect(component.spaces).toContain('more-spaces');
    });

    it('should report an error if getMoreSpaces() has an Observable error', () => {
      component.context = mockContext;
      spyOn(component.spaceService, 'getMoreSpacesByUser').and.returnValue(Observable.throw('error'));
      component.fetchMoreSpaces(mockEvent);
      expect(component.logger.error).toHaveBeenCalledWith('error');
    });

    it('should log an error if the context or context.user is empty', () => {
      component.context = {};
      component.fetchMoreSpaces(mockEvent);
      expect(component.logger.error).toHaveBeenCalledWith('Failed to retrieve list of spaces owned by user');
    });
  });

  // describe('#removeSpace', () => {});

  // describe('#confirmDeleteSpace', () => {});

  describe('#openForgeWizard', () => {
    it('should show the modal if there exists a GitHub token for the user', () => {
      let addSpace = jasmine.createSpy('TemplateRef');
      mockAuthenticationService.getGitHubToken.and.returnValue('gh-test-user');
      component.openForgeWizard(addSpace);
      expect(component.selectedFlow).toBe('start');
      expect(component.modalService.show).toHaveBeenCalled();
    });

    it('should broadcast an event indicating a disconnection from GitHub if no token', () => {
      let addSpace = jasmine.createSpy('TemplateRef');
      mockAuthenticationService.getGitHubToken.and.returnValue('');
      component.openForgeWizard(addSpace);
      expect(component.broadcaster.broadcast).toHaveBeenCalled();
    });
  });

  describe('#closeModal', () => {
    it('should hide the modal', () => {
      component.modalRef = mockModalRef;
      component.closeModal(mockEvent);
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
