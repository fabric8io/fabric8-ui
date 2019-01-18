import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CollaboratorService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { Observable, of as observableOf } from 'rxjs';
import { createMock } from 'testing/mock';
import { initContext, TestContext } from 'testing/test-context';
import { AddCollaboratorsDialogComponent } from './add-collaborators-dialog.component';

@Component({
  template: '<add-collaborators-dialog></add-collaborators-dialog>',
})
class HostComponent {}

describe('AddCollaboratorsDialog', () => {
  const testContext = initContext(
    AddCollaboratorsDialogComponent,
    HostComponent,
    {
      imports: [FormsModule, NgSelectModule],
      providers: [
        { provide: UserService, useValue: createMock(UserService) },
        { provide: CollaboratorService, useValue: createMock(CollaboratorService) },
      ],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
    },
    (component: AddCollaboratorsDialogComponent): void => {
      component.spaceId = 'fake-space-id';

      const modalDirective: jasmine.SpyObj<ModalDirective> = createMock(ModalDirective);
      modalDirective.hide.and.stub();
      component.host = modalDirective;
    },
  );

  it('should be instantiable', function() {
    expect(testContext.testedDirective).toBeTruthy();
  });

  it('should reset state on add', function() {
    const collaboratorService: jasmine.SpyObj<CollaboratorService> = TestBed.get(
      CollaboratorService,
    );
    collaboratorService.addCollaborators.and.returnValue(observableOf(true));

    expect(testContext.testedDirective.host.hide).not.toHaveBeenCalled();
    testContext.testedDirective.collaborators = [
      { id: 'foo-user' } as User,
      { id: 'bar-user' } as User,
    ];
    testContext.testedDirective.selectedCollaborators = [{ id: 'foo-user' } as User];

    testContext.testedDirective.addCollaborators();

    expect(collaboratorService.addCollaborators).toHaveBeenCalledWith('fake-space-id', [
      { id: 'foo-user' },
    ]);
    expect(testContext.testedDirective.host.hide).toHaveBeenCalled();
    expect(testContext.testedDirective.collaborators).toEqual([]);
    expect(testContext.testedDirective.selectedCollaborators).toEqual([]);
  });

  it('should reset state on cancel', function() {
    expect(testContext.testedDirective.host.hide).not.toHaveBeenCalled();
    testContext.testedDirective.collaborators = [
      { id: 'foo-user' } as User,
      { id: 'bar-user' } as User,
    ];
    testContext.testedDirective.selectedCollaborators = [{ id: 'foo-user' } as User];

    testContext.testedDirective.cancel();

    expect(testContext.testedDirective.host.hide).toHaveBeenCalled();
    expect(testContext.testedDirective.collaborators).toEqual([]);
    expect(testContext.testedDirective.selectedCollaborators).toEqual([]);
  });
});
