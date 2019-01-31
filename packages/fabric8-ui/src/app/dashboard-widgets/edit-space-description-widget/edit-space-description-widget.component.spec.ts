import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Broadcaster } from 'ngx-base';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollaboratorService, Contexts, Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { ConnectableObservable, Observable, of as observableOf } from 'rxjs';
import { createMock } from 'testing/mock';
import { initContext, TestContext } from 'testing/test-context';
import { SpaceNamespaceService } from '../../shared/runtime-console/space-namespace.service';
import { AddCollaboratorsDialogModule } from '../../space/settings/collaborators/add-collaborators-dialog/add-collaborators-dialog.module';
import { EditSpaceDescriptionWidgetComponent } from './edit-space-description-widget.component';

@Component({
  template: '<fabric8-edit-space-description-widget></fabric8-edit-space-description-widget>',
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
      version: 0,
    },
    relationships: {
      'owned-by': {
        data: {
          id: 'mock-id-1',
        },
      },
    },
  };
  const mockUsers: any = [
    { id: 'mock-id-d', attributes: { username: 'mock-username-d', fullName: 'Dave' } },
    { id: 'mock-id-a', attributes: { username: 'mock-username-a', fullName: 'Ava' } },
    { id: 'mock-id-c', attributes: { username: 'mock-username-c', fullName: 'Charles' } },
  ];

  const testContext = initContext(EditSpaceDescriptionWidgetComponent, HostComponent, {
    imports: [ModalModule.forRoot(), AddCollaboratorsDialogModule],
    providers: [
      {
        provide: Spaces,
        useFactory: () => {
          const mockSpaces: jasmine.SpyObj<Spaces> = createMock(Spaces);
          mockSpaces.current = observableOf(mockSpace) as Observable<Space> & jasmine.Spy;
          return mockSpaces;
        },
      },
      {
        provide: Contexts,
        useFactory: () => {
          const mockContexts: jasmine.SpyObj<Contexts> = createMock(Contexts);
          return mockContexts;
        },
      },
      {
        provide: UserService,
        useFactory: () => {
          const mockUserService: jasmine.SpyObj<UserService> = createMock(UserService);
          mockUserService.loggedInUser = observableOf(mockUsers[0]) as ConnectableObservable<User> &
            jasmine.Spy;
          mockUserService.getUserByUserId.and.returnValue(observableOf(mockUsers[0]) as Observable<
            User
          >);
          return mockUserService;
        },
      },
      {
        provide: Broadcaster,
        useFactory: () => {
          const mockBroadcaster: jasmine.SpyObj<Broadcaster> = createMock(Broadcaster);
          return mockBroadcaster;
        },
      },
      {
        provide: SpaceService,
        useFactory: () => {
          const mockSpaceService: jasmine.SpyObj<SpaceService> = createMock(SpaceService);
          return mockSpaceService;
        },
      },
      {
        provide: SpaceNamespaceService,
        useFactory: () => {
          const mockSpaceNamespaceService: jasmine.SpyObj<SpaceNamespaceService> = createMock(
            SpaceNamespaceService,
          );
          return mockSpaceNamespaceService;
        },
      },
      {
        provide: CollaboratorService,
        useFactory: () => {
          const mockCollaboratorService: jasmine.SpyObj<CollaboratorService> = createMock(
            CollaboratorService,
          );
          mockCollaboratorService.getInitialBySpaceId.and.returnValue(observableOf(
            mockUsers,
          ) as Observable<User[]>);
          mockCollaboratorService.getTotalCount.and.returnValue(observableOf(mockUsers.length));
          return mockCollaboratorService;
        },
      },
    ],
    schemas: [NO_ERRORS_SCHEMA],
  });

  describe('Component', () => {
    it("should display the space's creator in the masthead", function() {
      const el: DebugElement = testContext.fixture.debugElement.query(
        By.css('.f8-space-masthead-owner'),
      );
      expect(el.nativeElement.textContent.trim()).toEqual(mockUsers[0].attributes.username);
    });

    it('should display the number of collaborators in the masthead', function() {
      const el: DebugElement = testContext.fixture.debugElement.query(
        By.css('.f8-space-masthead-space-info'),
      );
      expect(el.nativeElement.textContent.trim()).toContain(mockUsers.length);
    });

    it('should have a link to add collaborators if the user owns the space', function() {
      testContext.testedDirective.userOwnsSpace = true;
      testContext.fixture.detectChanges();
      const link: DebugElement = testContext.fixture.debugElement.query(By.css('a'));
      expect(link).toBeDefined();
    });

    it('should have a link to add collaborators if the user is admin of the space', function() {
      testContext.testedDirective.userIsSpaceAdmin = true;
      testContext.fixture.detectChanges();
      const link: DebugElement = testContext.fixture.debugElement.query(By.css('a'));
      expect(link).toBeDefined();
    });

    it("should not have a link to add collaborators if the user doesn't own the space", function() {
      testContext.testedDirective.userOwnsSpace = false;
      testContext.fixture.detectChanges();
      const link: DebugElement = testContext.fixture.debugElement.query(By.css('a'));
      expect(link).toBeNull();
    });

    it('should filter collaborators on search term change', function() {
      testContext.testedDirective.popoverInit(10);
      expect(testContext.testedDirective.filteredCollaborators).toEqual(mockUsers);

      testContext.testedDirective.onCollaboratorSearchChange('Dave');
      expect(testContext.testedDirective.filteredCollaborators).toEqual([
        { id: 'mock-id-d', attributes: { username: 'mock-username-d', fullName: 'Dave' } },
      ]);

      testContext.testedDirective.onCollaboratorSearchChange('av');
      expect(testContext.testedDirective.filteredCollaborators).toEqual([
        { id: 'mock-id-d', attributes: { username: 'mock-username-d', fullName: 'Dave' } },
        { id: 'mock-id-a', attributes: { username: 'mock-username-a', fullName: 'Ava' } },
      ]);

      testContext.testedDirective.onCollaboratorSearchChange('');
      expect(testContext.testedDirective.filteredCollaborators).toEqual(mockUsers);
    });
  });

  describe('#saveDescription', () => {
    it('should be called when the save button is clicked', function() {
      spyOn(testContext.testedDirective, 'isEditable').and.returnValue(observableOf(true));
      spyOn(testContext.testedDirective, 'saveDescription');
      testContext.testedDirective.userOwnsSpace = true;
      testContext.testedDirective.startEditingDescription();
      testContext.fixture.detectChanges();
      const button: DebugElement = testContext.fixture.debugElement.query(
        By.css('#workItemTitle_btn_save_description'),
      );
      button.nativeElement.click();
      expect(testContext.testedDirective.saveDescription).toHaveBeenCalled();
    });
  });

  describe('#onUpdateDescription', () => {
    xit('should be called when the enter key is pressed', function() {
      const mockedSpaceService = TestBed.get(SpaceService);
      mockedSpaceService.update.and.returnValue(
        observableOf({
          attributes: {
            description: 'some mock description',
          },
        }),
      );
      spyOn(testContext.testedDirective, 'isEditable').and.returnValue(observableOf(true));
      spyOn(testContext.testedDirective, 'onUpdateDescription');
      testContext.testedDirective.userOwnsSpace = true;
      testContext.testedDirective.startEditingDescription();
      testContext.fixture.detectChanges();
      const textarea: DebugElement = testContext.fixture.debugElement.query(By.css('textarea'));
      textarea.triggerEventHandler('keyup.enter', {});
      expect(testContext.testedDirective.onUpdateDescription).toHaveBeenCalled();
    });
  });

  describe('#addCollaboratorsToParent', () => {
    it('should add new collaborators', function() {
      expect(testContext.testedDirective.collaborators).toEqual([]);

      const newUsers: User[] = [
        {
          id: 'mock-id-e',
          attributes: {
            username: 'mock-username-e',
            fullName: 'Edith',
          },
        },
        {
          id: 'mock-id-b',
          attributes: {
            username: 'mock-username-b',
            fullName: 'Brenda',
          },
        },
      ] as User[];

      testContext.testedDirective.addCollaboratorsToParent(newUsers);

      expect(testContext.testedDirective.collaborators).toEqual(newUsers);
    });
  });
});
