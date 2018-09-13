import { DebugNode, ErrorHandler } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Broadcaster, Logger, Notifications } from 'ngx-base';
import { ProcessTemplate, Space, SpaceService } from 'ngx-fabric8-wit';
import { Profile, User, UserService } from 'ngx-login-client';
import { Observable, of as observableOf,  throwError as observableThrowError } from 'rxjs';
import { ContextService } from '../../shared/context.service';
import { SpaceNamespaceService } from '../../shared/runtime-console/space-namespace.service';
import { SpaceTemplateService } from '../../shared/space-template.service';
import { SpacesService } from '../../shared/spaces.service';
import { AddSpaceOverlayComponent } from './add-space-overlay.component';


describe('AddSpaceOverlayComponent', () => {

  let fixture: ComponentFixture<AddSpaceOverlayComponent>;
  let component: DebugNode['componentInstance'];
  let mockBroadcaster: any = jasmine.createSpyObj('Broadcaster', ['broadcast']);
  let mockRouter: any = jasmine.createSpyObj('Router', ['navigate']);
  let mockSpaceTemplateService: any = {
    getSpaceTemplates: () => {
      return observableOf(mockSpaceTemplates);
    }
  };
  let mockSpaceService: any = jasmine.createSpyObj('SpaceService', ['create']);
  let mockNotifications: any = jasmine.createSpyObj('Notifications', ['message']);
  let mockUserService: any = jasmine.createSpy('UserService');
  let mockSpaceNamespaceService: any = jasmine.createSpy('SpaceNamespaceService');
  let mockSpacesService: any = jasmine.createSpy('SpacesService');
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

  let mockSpaceTemplates: ProcessTemplate[] = [{
    attributes: {
      'can-construct': false,
      description: 'Description-1',
      name: 'Template - 01'
    },
    id: 'template-01',
    type: 'spacetemplates'
  }, {
    attributes: {
      'can-construct': true,
      description: 'Description-2',
      name: 'Template - 02'
    },
    id: 'template-02',
    type: 'spacetemplates'
  }, {
    attributes: {
      'can-construct': true,
      description: 'Description-3',
      name: 'Template - 03'
    },
    id: 'template-03',
    type: 'spacetemplates'
  }] as ProcessTemplate[];

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
        { provide: SpaceTemplateService, useValue: mockSpaceTemplateService },
        { provide: SpaceService, useValue: mockSpaceService },
        { provide: Notifications, useValue: mockNotifications },
        { provide: UserService, useValue: mockUserService },
        { provide: SpaceNamespaceService, useValue: mockSpaceNamespaceService },
        { provide: SpacesService, useValue: mockSpacesService },
        { provide: ContextService, useValue: mockContextService },
        { provide: Logger, useValue: mockLogger },
        { provide: ErrorHandler, useValue: mockErrorHandler }
      ]
    });
    fixture = TestBed.createComponent(AddSpaceOverlayComponent);
    component = fixture.debugElement.componentInstance;
  });

  describe('#createSpace', () => {
    it('should add space template if available', () => {
      component.selectedTemplate = mockSpaceTemplates[1];
      component.createSpace();
      expect(component.space.relationships.hasOwnProperty('space-template'))
        .toBeTruthy();
      expect(component.space.relationships['space-template'].data.id)
        .toBe('template-02');
    });

    it('should disable submit', () => {
      mockUserService.currentLoggedInUser = {};
      component.context = {
        current: observableOf(mockSpace)
      };
      component.ngOnInit();

      const submitBtnEl = fixture.debugElement.query(By.css('button[type=submit]'));

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

  describe('#getSpaceTemplate', () => {
    it('should fetch and store the space templates', fakeAsync(() => {
      component.context = {
        current: observableOf(mockSpace)
      };
      spyOn(component.spaceTemplateService, 'getSpaceTemplates').and.returnValue(
        observableOf(mockSpaceTemplates)
      );
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.spaceTemplateService.getSpaceTemplates).toHaveBeenCalled();
      expect(component.spaceTemplates.length).toBe(2);
      expect(component.selectedTemplate).toEqual(mockSpaceTemplates[1]);
    }));

    it('should make selected space template null', fakeAsync(() => {
      component.context = {
        current: observableOf(mockSpace)
      };
      spyOn(component.spaceTemplateService, 'getSpaceTemplates').and.returnValue(
        observableOf([mockSpaceTemplates[0]])
      );
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.spaceTemplateService.getSpaceTemplates).toHaveBeenCalled();
      expect(component.spaceTemplates.length).toBe(0);
      expect(component.selectedTemplate).toBeNull();
    }));

    it('should handle error and set the default spacetemplate', fakeAsync(() => {
      component.context = {
        current: observableOf(mockSpace)
      };
      spyOn(component.spaceTemplateService, 'getSpaceTemplates').and.returnValue(
        observableThrowError('err')
      );
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.spaceTemplateService.getSpaceTemplates).toHaveBeenCalled();
      expect(component.spaceTemplates.length).toBe(1);
      expect(component.selectedTemplate.id).toBe('0');
    }));
  });

});
