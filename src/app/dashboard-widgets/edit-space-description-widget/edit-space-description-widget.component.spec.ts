import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { sortBy } from 'lodash';
import { Broadcaster } from 'ngx-base';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollaboratorService, Contexts, Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { ConnectableObservable,  Observable, of as observableOf } from 'rxjs';
import { createMock } from 'testing/mock';
import { initContext, TestContext } from 'testing/test-context';
import { SpaceNamespaceService } from '../../shared/runtime-console/space-namespace.service';
import { AddCollaboratorsDialogModule } from '../../space/settings/collaborators/add-collaborators-dialog/add-collaborators-dialog.module';
import { EditSpaceDescriptionWidgetComponent } from './edit-space-description-widget.component';

@Component({
  template: '<fabric8-edit-space-description-widget></fabric8-edit-space-description-widget>'
})
class HostComponent {}

describe('EditSpaceDescriptionWidgetComponent', () => {

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
    { id: 'mock-id-d', attributes: { username: 'mock-username-d', fullName: 'D' } },
    { id: 'mock-id-a', attributes: { username: 'mock-username-a', fullName: 'A' } },
    { id: 'mock-id-c', attributes: { username: 'mock-username-c', fullName: 'C' } }
  ];

  const testContext = initContext(EditSpaceDescriptionWidgetComponent, HostComponent, {
    imports: [
      ModalModule.forRoot(),
      AddCollaboratorsDialogModule
    ],
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
    it('should display the space\'s creator in the masthead', function() {
      let el: DebugElement = testContext.fixture.debugElement.query(By.css('.f8-space-masthead-owner'));
      expect(el.nativeElement.textContent.trim()).toEqual(mockUsers[0].attributes.username);
    });

    it('should display the number of collaborators in the masthead', function() {
      let el: DebugElement = testContext.fixture.debugElement.query(By.css('.f8-space-masthead-space-info'));
      expect(el.nativeElement.textContent.trim()).toContain(mockUsers.length);
    });

    it('should have a link to add collaborators if the user owns the space', function() {
      testContext.testedDirective.userOwnsSpace = true;
      testContext.fixture.detectChanges();
      let link: DebugElement = testContext.fixture.debugElement.query(By.css('a'));
      expect(link).toBeDefined();
    });

    it('should not have a link to add collaborators if the user doesn\'t own the space', function() {
      testContext.testedDirective.userOwnsSpace = false;
      testContext.fixture.detectChanges();
      let link: DebugElement = testContext.fixture.debugElement.query(By.css('a'));
      expect(link).toBeNull();
    });

    it('should sort list of collaborators for display', function() {
      expect(testContext.testedDirective.collaborators).toEqual(sortBy(mockUsers, (user: User): string => user.attributes.fullName));
    });
  });

  describe('#saveDescription', () => {
    it('should be called when the save button is clicked', function() {
      spyOn(testContext.testedDirective, 'isEditable').and.returnValue(observableOf(true));
      spyOn(testContext.testedDirective, 'saveDescription');
      testContext.testedDirective.userOwnsSpace = true;
      testContext.testedDirective.startEditingDescription();
      testContext.fixture.detectChanges();
      let button: DebugElement = testContext.fixture.debugElement.query(By.css('#workItemTitle_btn_save_description'));
      button.nativeElement.click();
      expect(testContext.testedDirective.saveDescription).toHaveBeenCalled();
    });
  });

  describe('#onUpdateDescription', () => {
    xit('should be called when the enter key is pressed', function() {
      const mockedSpaceService = TestBed.get(SpaceService);
      mockedSpaceService.update.and.returnValue(observableOf({
        attributes: {
          description: 'some mock description'
        }
      }));
      spyOn(testContext.testedDirective, 'isEditable').and.returnValue(observableOf(true));
      spyOn(testContext.testedDirective, 'onUpdateDescription');
      testContext.testedDirective.userOwnsSpace = true;
      testContext.testedDirective.startEditingDescription();
      testContext.fixture.detectChanges();
      let textarea: DebugElement = testContext.fixture.debugElement.query(By.css('textarea'));
      textarea.triggerEventHandler('keyup.enter', {});
      expect(testContext.testedDirective.onUpdateDescription).toHaveBeenCalled();
    });
  });

  describe('#addCollaboratorsToParent', () => {
    it('should add new collaborators', function() {
      expect(testContext.testedDirective.collaborators.length).toEqual(3);

      testContext.testedDirective.addCollaboratorsToParent([
        { id: 'mock-id-b', attributes: { username: 'mock-username-b' } }
      ] as User[]);

      expect(testContext.testedDirective.collaborators.length).toBe(4);
    });

    it('should maintain sort', function() {
      expect(testContext.testedDirective.collaborators.length).toEqual(3);

      const newUser: User = {
        id: 'mock-id-b', attributes: { username: 'mock-username-b', fullName: 'B' }
      } as User;
      testContext.testedDirective.addCollaboratorsToParent([ newUser ]);

      expect(testContext.testedDirective.collaborators).toEqual(sortBy(mockUsers.concat(newUser), (user: User): string => user.attributes.fullName));
    });
  });

});
