import {
  Component,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CollaboratorService } from 'ngx-fabric8-wit';
import {
  User,
  UserService
} from 'ngx-login-client';
import { Observable,  of as observableOf } from 'rxjs';
import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';
import { AddCollaboratorsDialogComponent } from './add-collaborators-dialog.component';

@Component({
  template: '<add-collaborators-dialog></add-collaborators-dialog>'
})
class HostComponent { }

describe('AddCollaboratorsDialog', () => {
  type Context = TestContext<AddCollaboratorsDialogComponent, HostComponent>;

  initContext(AddCollaboratorsDialogComponent, HostComponent, {
    imports: [ FormsModule ],
    providers: [
      { provide: UserService, useValue: createMock(UserService) },
      { provide: CollaboratorService, useValue: createMock(CollaboratorService) }
    ],
    declarations: [ ],
    schemas: [NO_ERRORS_SCHEMA]
  }, (component: AddCollaboratorsDialogComponent): void => {
    component.spaceId = 'fake-space-id';

    const modalDirective: jasmine.SpyObj<ModalDirective> = createMock(ModalDirective);
    modalDirective.hide.and.stub();
    component.host = modalDirective;
  });

  it('should be instantiable', function(this: Context) {
    expect(this.testedDirective).toBeTruthy();
  });

  it('should reset state on add', function(this: Context) {
    const collaboratorService: jasmine.SpyObj<CollaboratorService> = TestBed.get(CollaboratorService);
    collaboratorService.addCollaborators.and.returnValue(observableOf(true));

    expect(this.testedDirective.host.hide).not.toHaveBeenCalled();
    this.testedDirective.collaborators = [{ id: 'foo-user' } as User, { id: 'bar-user' } as User];
    this.testedDirective.selectedCollaborators = [{ id: 'foo-user' } as User];

    this.testedDirective.addCollaborators();

    expect(collaboratorService.addCollaborators).toHaveBeenCalledWith('fake-space-id', [{ id: 'foo-user' }]);
    expect(this.testedDirective.host.hide).toHaveBeenCalled();
    expect(this.testedDirective.collaborators).toEqual([]);
    expect(this.testedDirective.selectedCollaborators).toEqual([]);
  });

  it('should reset state on cancel', function(this: Context) {
    expect(this.testedDirective.host.hide).not.toHaveBeenCalled();
    this.testedDirective.collaborators = [{ id: 'foo-user' } as User, { id: 'bar-user' } as User];
    this.testedDirective.selectedCollaborators = [{ id: 'foo-user' } as User];

    this.testedDirective.cancel();

    expect(this.testedDirective.host.hide).toHaveBeenCalled();
    expect(this.testedDirective.collaborators).toEqual([]);
    expect(this.testedDirective.selectedCollaborators).toEqual([]);
  });
});
