import { DebugNode, ErrorHandler } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Broadcaster, Logger, Notification, Notifications, NotificationType } from 'ngx-base';
import { Space, SpaceNamePipe, SpaceService } from 'ngx-fabric8-wit';
import { Profile, User, UserService } from 'ngx-login-client';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { SpaceNamespaceService } from 'app/shared/runtime-console/space-namespace.service';
import { Feature, FeatureTogglesService } from '../../feature-flag/service/feature-toggles.service';
import { ContextService } from '../../shared/context.service';
import { DummyService } from '../../shared/dummy.service';
import { SpacesService } from '../../shared/spaces.service';
import { SpaceWizardComponent } from './space-wizard.component';


describe('SpaceWizardComponent', () => {

  let fixture: ComponentFixture<SpaceWizardComponent>;
  let component: DebugNode['componentInstance'];
  let mockBroadcaster: any = jasmine.createSpyObj('Broadcaster', ['broadcast']);
  let mockFeatureTogglesService = jasmine.createSpyObj('FeatureTogglesService', ['getFeature']);
  let mockRouter: any = jasmine.createSpyObj('Router', ['navigate']);
  let mockDummyService: any = jasmine.createSpy('DummyService');
  let mockSpaceService: any = jasmine.createSpyObj('SpaceService', ['create']);
  let mockNotifications: any = jasmine.createSpyObj('Notifications', ['message']);
  let mockUserService: any = jasmine.createSpyObj('UserService', ['getUser']);
  let mockSpaceNamespaceService: any = jasmine.createSpy('SpaceNamespaceService');
  let mockSpaceNamePipe: any = jasmine.createSpy('SpaceNamePipe');
  let mockSpacesService: any = jasmine.createSpyObj('SpacesService', ['addRecent']);
  let mockContextService: any = jasmine.createSpy('ContextService');
  let mockLogger: any = jasmine.createSpyObj('Logger', ['error']);
  let mockErrorHandler: any = jasmine.createSpyObj('ErrorHandler', ['handleError']);
  let mockSubject: any = jasmine.createSpy('Subject');

  let mockProfile: Profile = {
    fullName: 'mock-fullName',
    imageURL: 'mock-imageURL',
    username: 'mock-username'
  };

  let mockUser: User = {
    id: 'mock-id',
    attributes: mockProfile,
    type: 'mock-type'
  };

  let mockSpace: Space = {
    name: 'mock-space',
    path: 'mock-path',
    teams: [
      { name: 'mock-name', members: [ mockUser ] }
    ],
    defaultTeam: { name: 'mock-name', members: [ mockUser ] },
    id: 'mock-id',
    attributes: {
      name: 'mock-attribute',
      description: 'mock-description',
      'updated-at': 'mock-updated-at',
      'created-at': 'mock-created-at',
      version: 0
    },
    type: 'mock-type',
    links: {
      self: 'mock-self'
    },
    relationships: {
      areas: { links: { related: 'mock-related' } },
      iterations: { links: { related: 'mock-related' } },
      workitemtypegroups: { links: { related: 'mock-related' } },
      'owned-by': {
        data: {
          id: mockUser.id,
          type: mockUser.type
        }
      }
    },
    relationalData: {
      creator: mockUser
    }
  };

  let mockMessage: Notification = {
    message: `Failed to create "${mockSpace.name}"`,
    type: NotificationType.DANGER
  };

  let mockFeature: Feature = {
    'attributes': {
      'name': 'mock-attribute',
      'enabled': true,
      'user-enabled': true
    }
  };

  mockFeatureTogglesService.getFeature.and.returnValue(Observable.of(mockFeature));
  mockSpaceNamespaceService.updateConfigMap = {};
  mockSpaceService.create.and.returnValue(Observable.of(mockSpace));
  mockSpacesService.addRecent.and.returnValue(mockSubject);
  mockSpacesService.addRecent.next = {};
  mockUserService.currentLoggedInUser = { 'id': 'mock-user' };
  mockUserService.getUser.and.returnValue(Observable.of(mockUser));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SpaceWizardComponent],
      providers: [
        { provide: Broadcaster, useValue: mockBroadcaster },
        { provide: FeatureTogglesService, useValue: mockFeatureTogglesService },
        { provide: Router, useValue: mockRouter },
        { provide: DummyService, useValue: mockDummyService },
        { provide: SpaceService, useValue: mockSpaceService },
        { provide: Notifications, useValue: mockNotifications },
        { provide: UserService, useValue: mockUserService },
        { provide: SpaceNamespaceService, useValue: mockSpaceNamespaceService },
        { provide: SpaceNamePipe, useValue: mockSpaceNamePipe },
        { provide: SpacesService, useValue: mockSpacesService },
        { provide: ContextService, useValue: mockContextService },
        { provide: Logger, useValue: mockLogger },
        { provide: ErrorHandler, useValue: mockErrorHandler }
      ]
    });
    fixture = TestBed.createComponent(SpaceWizardComponent);
    component = fixture.debugElement.componentInstance;
  });

  describe('#createSpace', () => {
    it('should create a transient space if the space doesn\'t currently exist', () => {
      component.space = null;
      component.createSpace();
      expect(component.space).toBeDefined();
    });

    it('should ignore any errors from SpaceNamespaceService and continue', () => {
      component.space = mockSpace;
      spyOn(mockSpaceNamespaceService, 'updateConfigMap').and.returnValue('not-a-configMap');
      spyOn(mockSpacesService.addRecent, 'next').and.returnValue(mockSpace);
      spyOn(component, 'finish');
      component.createSpace();
      expect(mockNotifications.message).toHaveBeenCalledWith(mockMessage);
      expect(component.finish).toHaveBeenCalled();
    });

    it('should navigate to the created space upon successful completion', () => {
      component.space = mockSpace;
      spyOn(mockSpaceNamespaceService, 'updateConfigMap').and.returnValue(Observable.of(mockSpace));
      spyOn(mockSpacesService.addRecent, 'next').and.returnValue(mockSpace);
      spyOn(component, 'finish');
      component.createSpace();
      expect(mockRouter.navigate).toHaveBeenCalledWith([mockSpace.relationalData.creator.attributes.username, mockSpace.attributes.name]);
      expect(component.finish).toHaveBeenCalled();
    });

    it('should show a notification if failed to create a space', () => {
      component.space = mockSpace;
      component.createSpace();
      expect(component.notifications.message).toHaveBeenCalledWith(mockMessage);
    });

    it('should call finish() upon completion', () => {
      component.space = mockSpace;
      spyOn(component, 'finish');
      component.createSpace();
      expect(component.finish).toHaveBeenCalled();
    });
  });

  describe('#finish', () => {
    it('should emit the space\'s name from the onSelect EventEmitter', () => {
      let mockEmit = {
        flow: 'selectFlow',
        space: component.space.attributes.name
      };
      spyOn(component.onSelect, 'emit');
      component.finish();
      expect(component.onSelect.emit).toHaveBeenCalledWith(mockEmit);
    });
  });

  describe('#cancel', () => {
    it('should emit an empty object from the onCancel EventEmitter', () => {
      spyOn(component.onCancel, 'emit');
      component.cancel();
      expect(component.onCancel.emit).toHaveBeenCalledWith({});
    });
  });

  describe('#showAddSpaceOverlay', () => {
    it('should broadcast the overlay as described', () => {
      component.showAddSpaceOverlay();
      expect(mockBroadcaster.broadcast).toHaveBeenCalledWith('showAddSpaceOverlay', true);
    });
  });

});
