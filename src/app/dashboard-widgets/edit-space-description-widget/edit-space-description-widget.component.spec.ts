import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Broadcaster } from 'ngx-base';
import { CollaboratorService, Contexts, Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { ConnectableObservable,  Observable, of as observableOf } from 'rxjs';
import { createMock } from 'testing/mock';
import { initContext, TestContext } from 'testing/test-context';
import { SpaceNamespaceService } from '../../shared/runtime-console/space-namespace.service';
import { EditSpaceDescriptionWidgetComponent } from './edit-space-description-widget.component';

@Component({
  template: '<fabric8-edit-space-description-widget></fabric8-edit-space-description-widget>'
})
class HostComponent {}

describe('EditSpaceDescriptionWidgetComponent', () => {
  type Context = TestContext<EditSpaceDescriptionWidgetComponent, HostComponent>;
  const mockSpace: any = {
    name: 'mock-space',
    path: 'mock-path',
    id: 'mock-id-1',
    attributes: {
      name: 'mock-attribute',
      description: 'mock-description',
      'updated-at': 'mock-updated-at',
      'created-at': 'mock-created-at',
      version: 0
    },
    relationships: {
      'owned-by': {
        data: {
          id: 'mock-id-1'
        }
      }
    }
  };
  const mockUsers: any = [
    { id: 'mock-id-1', attributes: { username: 'mock-username-1' } },
    { id: 'mock-id-2', attributes: { username: 'mock-username-2' } },
    { id: 'mock-id-3', attributes: { username: 'mock-username-3' } }
  ];

  initContext(EditSpaceDescriptionWidgetComponent, HostComponent, {
    providers: [
      { provide: Spaces, useFactory: () => {
          let mockSpaces: jasmine.SpyObj<Spaces> = createMock(Spaces);
          mockSpaces.current = observableOf(mockSpace) as Observable<Space> & jasmine.Spy;
          return mockSpaces;
        }
      },
      { provide: Contexts, useFactory: () => {
          let mockContexts: jasmine.SpyObj<Contexts> = createMock(Contexts);
          return mockContexts;
        }
      },
      { provide: UserService, useFactory: () => {
          let mockUserService: jasmine.SpyObj<UserService> = createMock(UserService);
          mockUserService.loggedInUser = observableOf(mockUsers[0]) as ConnectableObservable<User> & jasmine.Spy;
          mockUserService.getUserByUserId.and.returnValue(observableOf(mockUsers[0]) as Observable<User>);
          return mockUserService;
        }
      },
      { provide: Broadcaster, useFactory: () => {
          let mockBroadcaster: jasmine.SpyObj<Broadcaster> = createMock(Broadcaster);
          return mockBroadcaster;
        }
      },
      { provide: SpaceService, useFactory: () => {
          let mockSpaceService: jasmine.SpyObj<SpaceService> = createMock(SpaceService);
          return mockSpaceService;
        }
      },
      { provide: SpaceNamespaceService, useFactory: () => {
          let mockSpaceNamespaceService: jasmine.SpyObj<SpaceNamespaceService> = createMock(SpaceNamespaceService);
          return mockSpaceNamespaceService;
        }
      },
      { provide: CollaboratorService, useFactory: () => {
          let mockCollaboratorService: jasmine.SpyObj<CollaboratorService> = createMock(CollaboratorService);
          mockCollaboratorService.getInitialBySpaceId.and.returnValue(observableOf(mockUsers) as Observable<User[]>);
          return mockCollaboratorService;
        }
      }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  });

  describe('Component', () => {
    it('should display the space\'s creator in the masthead', function(this: Context) {
      let el: DebugElement = this.fixture.debugElement.query(By.css('.f8-space-masthead-owner'));
      expect(el.nativeElement.textContent.trim()).toEqual(mockUsers[0].attributes.username);
    });

    it('should display the number of collaborators in the masthead', function(this: Context) {
      let el: DebugElement = this.fixture.debugElement.query(By.css('.f8-space-masthead-space-info'));
      expect(el.nativeElement.textContent.trim()).toContain(mockUsers.length);
    });

    it('should have a link to add collaborators if the user owns the space', function(this: Context) {
      this.testedDirective.userOwnsSpace = true;
      this.fixture.detectChanges();
      let link: DebugElement = this.fixture.debugElement.query(By.css('a'));
      expect(link).toBeDefined();
    });

    it('should not have a link to add collaborators if the user doesn\'t own the space', function(this: Context) {
      this.testedDirective.userOwnsSpace = false;
      this.fixture.detectChanges();
      let link: DebugElement = this.fixture.debugElement.query(By.css('a'));
      expect(link).toBeNull();
    });
  });

  describe('#saveDescription', () => {
    it('should be called when the save button is clicked', function(this: Context) {
      spyOn(this.testedDirective, 'isEditable').and.returnValue(observableOf(true));
      spyOn(this.testedDirective, 'saveDescription');
      this.testedDirective.userOwnsSpace = true;
      this.testedDirective.startEditingDescription();
      this.fixture.detectChanges();
      let button: DebugElement = this.fixture.debugElement.query(By.css('#workItemTitle_btn_save_description'));
      button.nativeElement.click();
      expect(this.testedDirective.saveDescription).toHaveBeenCalled();
    });
  });

  describe('#onUpdateDescription', () => {
    it('should be called when the enter key is pressed', function(this: Context) {
      spyOn(this.testedDirective, 'isEditable').and.returnValue(observableOf(true));
      spyOn(this.testedDirective, 'onUpdateDescription');
      this.testedDirective.userOwnsSpace = true;
      this.testedDirective.startEditingDescription();
      this.fixture.detectChanges();
      let textarea: DebugElement = this.fixture.debugElement.query(By.css('textarea'));
      textarea.triggerEventHandler('keyup.enter', {});
      expect(this.testedDirective.onUpdateDescription).toHaveBeenCalled();
    });
  });

});
