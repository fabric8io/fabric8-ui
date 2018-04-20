import {
  Component,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  IMultiSelectOption,
  IMultiSelectSettings
} from 'angular-2-dropdown-multiselect';
import { Observable } from 'rxjs';
import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { CollaboratorService } from 'ngx-fabric8-wit';
import {
  User,
  UserService
} from 'ngx-login-client';

import { AddCollaboratorsDialogComponent } from './add-collaborators-dialog.component';

@Component({
  template: '<add-collaborators-dialog></add-collaborators-dialog>'
})
class HostComponent { }

@Component({
  selector: 'ss-multiselect-dropdown',
  template: ''
})
class FakeMultiselectDropdown {
  @Output('keyup') keyup = new EventEmitter<void>();
  @Input('options') options: IMultiSelectOption;
  @Input('settings') settings: IMultiSelectSettings;
  public dropdownModel: any[] = [];

  public clearSearch: jasmine.Spy = jasmine.createSpy('clearSearch');
  public uncheckAll: jasmine.Spy = jasmine.createSpy('uncheckAll');
}

describe('AddCollaboratorsDialog', () => {
  type Context = TestContext<AddCollaboratorsDialogComponent, HostComponent>;

  initContext(AddCollaboratorsDialogComponent, HostComponent, {
    imports: [ FormsModule ],
    providers: [
      { provide: UserService, useValue: createMock(UserService) },
      { provide: CollaboratorService, useValue: createMock(CollaboratorService) }
    ],
    declarations: [ FakeMultiselectDropdown ],
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
    collaboratorService.addCollaborators.and.returnValue(Observable.of(true));

    expect(this.testedDirective.dropdown.clearSearch).not.toHaveBeenCalled();
    expect(this.testedDirective.dropdown.uncheckAll).not.toHaveBeenCalled();
    expect(this.testedDirective.host.hide).not.toHaveBeenCalled();
    this.testedDirective.dropdownModel = [{ id: 'foo-user' } as User];
    this.testedDirective.dropdownOptions = [{} as IMultiSelectOption];

    this.testedDirective.addCollaborators();

    expect(collaboratorService.addCollaborators).toHaveBeenCalledWith('fake-space-id', [{ id: 'foo-user' }]);
    expect(this.testedDirective.dropdown.clearSearch).toHaveBeenCalled();
    expect(this.testedDirective.dropdown.uncheckAll).toHaveBeenCalled();
    expect(this.testedDirective.host.hide).toHaveBeenCalled();
    expect(this.testedDirective.dropdownModel).toEqual([]);
    expect(this.testedDirective.dropdownOptions).toEqual([]);
  });

  it('should reset state on cancel', function(this: Context) {
    expect(this.testedDirective.dropdown.clearSearch).not.toHaveBeenCalled();
    expect(this.testedDirective.dropdown.uncheckAll).not.toHaveBeenCalled();
    expect(this.testedDirective.host.hide).not.toHaveBeenCalled();
    this.testedDirective.dropdownModel = [{} as User];
    this.testedDirective.dropdownOptions = [{} as IMultiSelectOption];

    this.testedDirective.cancel();

    expect(this.testedDirective.dropdown.clearSearch).toHaveBeenCalled();
    expect(this.testedDirective.dropdown.uncheckAll).toHaveBeenCalled();
    expect(this.testedDirective.host.hide).toHaveBeenCalled();
    expect(this.testedDirective.dropdownModel).toEqual([]);
    expect(this.testedDirective.dropdownOptions).toEqual([]);
  });
});
