import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { cloneDeep } from 'lodash';
import { AuthenticationService, User } from 'ngx-login-client';
import { WorkItem } from '../../models/work-item';
import { WorkItemService } from '../../services/work-item.service';
import { UserUI } from './../../models/user';
import { SelectDropdownComponent } from './../../widgets/select-dropdown/select-dropdown.component';

@Component({
  selector: 'assignee-selector',
  templateUrl: './assignee-selector.component.html',
  styleUrls: ['./assignee-selector.component.less'],
})
export class AssigneeSelectorComponent {
  @ViewChild('dropdown') dropdownRef: SelectDropdownComponent;

  @Input() loggedInUser: UserUI;
  @Input() editAllow: boolean = false;

  allUsers: UserUI[] = [];
  @Input('allUsers') set allUsersSetter(val: UserUI[]) {
    this.allUsers = cloneDeep(val);
    this.backup = cloneDeep(
      this.allUsers.map((user) => {
        return {
          name: user.name,
          src: user.avatar,
          id: user.id,
          stickontop: false,
          selected: false,
        };
      }),
    );
    if (this.searchValue.length) {
      this.assignees = cloneDeep(this.backup.filter((i) => i.name.indexOf(this.searchValue) > -1));
    } else {
      this.assignees = cloneDeep(this.backup);
    }
    if (this.loggedInUser) {
      this.backup = [
        {
          name: this.loggedInUser.name,
          src: this.loggedInUser.avatar,
          id: this.loggedInUser.id,
          stickontop: true,
          selected: false,
        },
        ...this.backup,
      ];
      this.assignees = [this.backup[0], ...this.assignees];
      this.allUsers = [this.loggedInUser, ...this.allUsers];
    }
    this.updateSelection();
  }

  selectedAssignees: UserUI[] = [];
  _selectedAssigneesBackup: UserUI[] = [];
  @Input('selectedAssignees') set selectedAssigneesSetter(val) {
    this.selectedAssignees = cloneDeep(val);
    this._selectedAssigneesBackup = cloneDeep(val);
    this.updateSelection();
  }

  @Output() readonly onSelectAssignee: EventEmitter<UserUI[]> = new EventEmitter();
  @Output() readonly onOpenAssignee: EventEmitter<any> = new EventEmitter();
  @Output() readonly onCloseAssignee: EventEmitter<UserUI[]> = new EventEmitter();

  workItem: WorkItem;
  workItemRef: WorkItem;
  users: User[] = [];
  workItemPayload: WorkItem;
  searchAssignee: Boolean = false;

  private activeAddAssignee: boolean = false;

  private backup: any[] = [];
  private assignees: any[] = [];
  private searchValue: string = '';

  constructor(private auth: AuthenticationService, private workItemService: WorkItemService) {}

  onSelect(event: any) {
    let findSelectedIndex = this.selectedAssignees.findIndex((i) => i.id === event.id);
    if (findSelectedIndex > -1) {
      this.selectedAssignees.splice(findSelectedIndex, 1);
    } else {
      let findAssignee = cloneDeep(this.allUsers.find((i) => i.id === event.id));
      if (findAssignee) {
        this.selectedAssignees.push(findAssignee);
      }
    }
    this.updateSelection();
    this.onSelectAssignee.emit(cloneDeep(this.selectedAssignees));
  }
  updateSelection() {
    this.assignees.forEach((assignee, index) => {
      if (this.selectedAssignees.find((a) => assignee.id === a.id)) {
        this.assignees[index].selected = true;
      } else {
        this.assignees[index].selected = false;
      }
    });
    this.backup.forEach((assignee, index) => {
      if (this.selectedAssignees.find((a) => assignee.id === a.id)) {
        this.backup[index].selected = true;
      } else {
        this.backup[index].selected = false;
      }
    });
  }

  onSearch(event: any) {
    let needle = event.trim();
    this.searchValue = needle;
    if (needle.length) {
      this.assignees = cloneDeep(
        this.backup.filter(
          (i) => i.name.toLowerCase().indexOf(needle.toLowerCase()) > -1 || i.stickontop,
        ),
      );
    } else {
      this.assignees = cloneDeep(this.backup);
    }
  }

  cancelAssignment(): void {
    this.searchAssignee = false;
  }
  onOpen(event) {
    this.onOpenAssignee.emit('open');
  }
  onClose(event) {
    // Setting search input to empty string
    this.dropdownRef.setSearchText('');
    // Thus reset the value
    this.assignees = cloneDeep(this.backup);

    const compare1 = this.selectedAssignees.filter(
      (i) => this._selectedAssigneesBackup.findIndex((b) => b.id === i.id) === -1,
    );
    const compare2 = this._selectedAssigneesBackup.filter(
      (i) => this.selectedAssignees.findIndex((b) => b.id === i.id) === -1,
    );
    if (compare1.length !== 0 || compare2.length !== 0) {
      this.onCloseAssignee.emit(cloneDeep(this.selectedAssignees));
    }
  }

  openDropdown() {
    this.dropdownRef.openDropdown();
  }

  closeDropdown() {
    this.dropdownRef.closeDropdown();
  }
  closeAddAssignee() {
    this.activeAddAssignee = false;
  }
}
