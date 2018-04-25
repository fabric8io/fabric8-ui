import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';

import { IMultiSelectOption, IMultiSelectSettings, MultiselectDropdown } from 'angular-2-dropdown-multiselect';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CollaboratorService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';

@Component({
  host: {
    'class': 'add-dialog'
  },
  encapsulation: ViewEncapsulation.None,
  selector: 'add-collaborators-dialog',
  templateUrl: './add-collaborators-dialog.component.html',
  styleUrls: ['./add-collaborators-dialog.component.less']
})
export class AddCollaboratorsDialogComponent implements OnInit {

  @Input() host: ModalDirective;
  @Input() spaceId: string;

  @Output() onAdded = new EventEmitter<User[]>();

  @ViewChild('dropdown') dropdown: MultiselectDropdown;

  public dropdownOptions: IMultiSelectOption[] = [];
  public dropdownModel: User[];
  public dropdownSettings: IMultiSelectSettings;

  constructor(
    private userService: UserService,
    private collaboratorService: CollaboratorService
  ) { }

  ngOnInit() {
    this.dropdownSettings = {
      pullRight: false,
      enableSearch: true,
      checkedStyle: 'checkboxes',
      buttonClasses: 'btn btn-default',
      selectionLimit: 0,
      closeOnSelect: false,
      showCheckAll: false,
      showUncheckAll: false,
      dynamicTitleMaxItems: 3,
      maxHeight: '300px'
    };
  }

  public onOpen() {
    this.reset();
  }

  addCollaborators() {
    this.collaboratorService.addCollaborators(this.spaceId, this.dropdownModel).subscribe(() => {
      this.onAdded.emit(this.dropdownModel as User[]);
      this.reset();
      this.host.hide();
    });
  }

  changed(enteredValue: any) {
    let searchValue = this.dropdown.filterControl.value;
    this.userService.getUsersBySearchString(searchValue).subscribe((users) => {
      this.dropdownOptions = [];
      users.forEach(user => {
        this.dropdownOptions.push({
          id: user,
          name: user.attributes.fullName
        });
      });
    });
  }

  cancel() {
    this.reset();
    this.host.hide();
  }

  private reset() {
    this.dropdown.uncheckAll();
    this.dropdown.clearSearch(new CustomEvent('clear'));
    this.dropdownOptions = [];
    this.dropdownModel = [];
  }
}
