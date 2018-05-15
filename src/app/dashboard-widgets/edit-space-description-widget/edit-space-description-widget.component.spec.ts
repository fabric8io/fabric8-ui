import { DebugNode } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Broadcaster } from 'ngx-base';
import { Contexts, SpaceNamePipe, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { SpaceNamespaceService } from '../../shared/runtime-console/space-namespace.service';
import { EditSpaceDescriptionWidgetComponent } from './edit-space-description-widget.component';

describe('EditSpaceDescriptionWidgetComponent', () => {
  let fixture: ComponentFixture<EditSpaceDescriptionWidgetComponent>;
  let component: DebugNode['componentInstance'];

  let mockSpaces: any = jasmine.createSpy('Spaces');
  let mockContexts: any = jasmine.createSpy('Contexts');
  let mockUserService: any = jasmine.createSpy('UserService');
  let mockBroadcaster: any = jasmine.createSpy('Broadcaster');
  let mockSpaceService: any = jasmine.createSpy('SpaceService');
  let mockSpaceNamespaceService: any = jasmine.createSpy('SpaceNamespaceService');
  let mockElementRef: any = jasmine.createSpyObj('ElementRef', ['nativeElement']);
  let mockDescriptionUpdater: any = jasmine.createSpyObj('Subject', ['next']);
  let mockSpace: any = {
    name: 'mock-space',
    path: 'mock-path',
    id: 'mock-id',
    attributes: {
      name: 'mock-attribute',
      description: 'mock-description',
      'updated-at': 'mock-updated-at',
      'created-at': 'mock-created-at',
      version: 0
    }
  };

  mockElementRef.nativeElement.value = {};
  mockSpaces.current = Observable.of(mockSpace);
  mockUserService.loggedInUser = Observable.of({});

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSpaceDescriptionWidgetComponent, SpaceNamePipe],
      providers: [
        { provide: Spaces, useValue: mockSpaces },
        { provide: Contexts, useValue: mockContexts },
        { provide: UserService, useValue: mockUserService },
        { provide: Broadcaster, useValue: mockBroadcaster },
        { provide: SpaceService, useValue: mockSpaceService },
        { provide: SpaceNamespaceService, useValue: mockSpaceNamespaceService }
      ]
    });
    fixture = TestBed.createComponent(EditSpaceDescriptionWidgetComponent);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
    component.description = mockElementRef;

  });

  describe('#onUpdateDescription', () => {
    it('should delegate to _descriptionUpdater', () => {
      component._descriptionUpdater = mockDescriptionUpdater;
      component.onUpdateDescription('new-description');
      expect(component._descriptionUpdater.next).toHaveBeenCalledWith('new-description');
    });
  });

  describe('#saveDescription', () => {
    it('should delegate to _descriptionUpdater', () => {
      component._descriptionUpdater = mockDescriptionUpdater;
      mockElementRef.nativeElement.value = 'new-description';
      component.saveDescription();
      expect(component._descriptionUpdater.next).toHaveBeenCalledWith('new-description');
    });
  });

});
