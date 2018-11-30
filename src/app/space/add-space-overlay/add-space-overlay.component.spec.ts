import { DebugNode, ErrorHandler } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Broadcaster, Logger, Notifications } from 'ngx-base';
import { Space, SpaceService } from 'ngx-fabric8-wit';
import { Profile, User, UserService } from 'ngx-login-client';
import { of as observableOf } from 'rxjs';
import { ContextService } from '../../shared/context.service';
import { SpaceNamespaceService } from '../../shared/runtime-console/space-namespace.service';
import { AddSpaceOverlayComponent } from './add-space-overlay.component';


describe('AddSpaceOverlayComponent', () => {

  let fixture: ComponentFixture<AddSpaceOverlayComponent>;
  let component: DebugNode['componentInstance'];
  let mockBroadcaster: any = jasmine.createSpyObj('Broadcaster', ['broadcast']);
  let mockRouter: any = jasmine.createSpyObj('Router', ['navigate']);
  let mockSpaceService: any = jasmine.createSpyObj('SpaceService', ['create']);
  let mockNotifications: any = jasmine.createSpyObj('Notifications', ['message']);
  let mockUserService: any = jasmine.createSpy('UserService');
  let mockSpaceNamespaceService: any = jasmine.createSpy('SpaceNamespaceService');
  let mockContextService: any = jasmine.createSpy('ContextService');
  let mockLogger: any = jasmine.createSpyObj('Logger', ['error']);
  let mockErrorHandler: any = jasmine.createSpyObj('ErrorHandler', ['handleError']);
  let mockElementRef: any = jasmine.createSpyObj('ElementRef', ['nativeElement']);

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

  beforeEach(() => {
    mockElementRef.nativeElement.value = {};
    mockSpaceNamespaceService.updateConfigMap = {};
    mockSpaceService.create.and.returnValue(observableOf(mockSpace));
    mockUserService.currentLoggedInUser = mockUser;

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [AddSpaceOverlayComponent],
      providers: [
        { provide: Broadcaster, useValue: mockBroadcaster },
        { provide: Router, useValue: mockRouter },
        { provide: SpaceService, useValue: mockSpaceService },
        { provide: Notifications, useValue: mockNotifications },
        { provide: UserService, useValue: mockUserService },
        { provide: SpaceNamespaceService, useValue: mockSpaceNamespaceService },
        { provide: ContextService, useValue: mockContextService },
        { provide: Logger, useValue: mockLogger },
        { provide: ErrorHandler, useValue: mockErrorHandler }
      ]
    });
    fixture = TestBed.createComponent(AddSpaceOverlayComponent);
    component = fixture.debugElement.componentInstance;
  });

  describe('#createSpace', () => {

    it('should disable submit', () => {
      mockUserService.currentLoggedInUser = {};
      component.context = {
        current: observableOf(mockSpace)
      };
      component.ngOnInit();

      const submitBtnEl = fixture.debugElement.query(By.css('#createSpaceButton'));

      expect(submitBtnEl.nativeElement.disabled).toBeFalsy();
      expect(component.canSubmit).toBe(true);

      component.createSpace();

      expect(component.canSubmit).toBe(false);
      fixture.detectChanges();
      expect(submitBtnEl.nativeElement.disabled).toBeTruthy();
    });

    it('should save the description', () => {
      mockElementRef.nativeElement.value = 'mock-description';
      component.description = mockElementRef;
      component.createSpace();
      expect(component.space.attributes.description).toBe('mock-description');
    });
  });

});
