import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Modal } from 'ngx-modal';
import { Context, CollaboratorService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { ContextService } from '../../../shared/context.service';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

@Component({
  host: {
    'class': 'add-dialog'
  },
  encapsulation: ViewEncapsulation.None,
  selector: 'add-collaborators-dialog',
  templateUrl: './add-collaborators-dialog.component.html',
  styleUrls: ['./add-collaborators-dialog.component.less']
})
export class AddCollaboratorsDialogComponent implements OnInit, OnDestroy {

  @Input() host: Modal;
  @Input() spaceId: string;
  @Input() collaborators: User[];
  @Output() onAdded = new EventEmitter<User[]>();
  @ViewChild('typeahead') typeahead: any;

  public dropdownOptions: IMultiSelectOption[] = [];
  public dropdownModel: User[];
  public dropdownSettings: IMultiSelectSettings;
  private context: Context;
  private openSubscription: Subscription;

  constructor(
    private contexts: ContextService,
    private userService: UserService,
    private collaboratorService: CollaboratorService) {
    this.contexts.current.subscribe(val => this.context = val);
  }

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
      maxHeight: '300px',
    };

    this.openSubscription = this.host.onOpen.subscribe(() => {
      this.dropdownModel = [];
    })
  }

  ngOnDestroy() {
    this.openSubscription.unsubscribe();
  }

  addCollaborators () {
    this.host.close();
    this.collaboratorService.addCollaborators(this.spaceId, this.dropdownModel).subscribe(() => {
      this.onAdded.emit(this.dropdownModel as User[]);
      this.host.close();
    });
  }

  changed(enteredValue: any) {
    let searchValue = this.typeahead.searchFilterText;
    this.userService.getUsersBySearchString(searchValue).subscribe((users) => {
      this.dropdownOptions = [];
      users.forEach(user => {
        this.dropdownOptions.push({
          id: user,
          name: user.attributes.fullName
        });
      })
    });
  }

  cancel() {
    this.host.close();
  }
}
