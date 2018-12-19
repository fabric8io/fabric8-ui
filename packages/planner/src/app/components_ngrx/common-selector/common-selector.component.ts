import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { cloneDeep } from 'lodash';
import { User } from 'ngx-login-client';
import { SelectDropdownComponent } from './../../widgets/select-dropdown/select-dropdown.component';

@Component({
  selector: 'common-selector',
  templateUrl: './common-selector.component.html',
  styleUrls: ['./common-selector.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonSelectorComponent {
  @ViewChild('dropdown') dropdownRef: SelectDropdownComponent;

  private _internalItems: any[] = [];
  @Input('items') set listItemSetter(val: any[]) {
    this.backup = cloneDeep(val);
    if (this.searchValue.length) {
      this.menuItems = cloneDeep(this.backup.filter((i) => i.value.indexOf(this.searchValue) > -1));
    } else {
      this.menuItems = cloneDeep(this.backup);
    }
    this.updateSelection();
  }

  selectedItems: any[] = [];
  _selectedItemsBackup: any[] = [];
  @Input('selectedItems') set selectedItemsSetter(val) {
    this.selectedItems = cloneDeep(val);
    this._selectedItemsBackup = cloneDeep(val);
    this.updateSelection();
  }

  @Input('allowMultiSelect') allowMultiSelect: boolean = false;
  @Input('closeOnSelect') closeOnSelect: boolean = true;
  @Input('headerText') headerText: string = 'Default Header Text';
  @Input('noValueLabel') noValueLabel: string = 'None';
  @Input('allowUpdate') allowUpdate: boolean = true;
  @Input('itemTruncate') itemTruncate: number = 500;
  @Input('toggleTruncate') toggleTruncate: number = 500;

  @Output() readonly onSelectItem: EventEmitter<any[]> = new EventEmitter();
  @Output() readonly onOpenSelector: EventEmitter<any> = new EventEmitter();
  @Output() readonly onCloseSelector: EventEmitter<any[]> = new EventEmitter();

  private backup: any[] = [];
  private searchValue: string = '';
  private menuItems: any[] = [];
  isOpen: boolean = false;

  constructor() {}

  onSelect(event: any) {
    // If 'No match found' selected then do nothing
    if (event.key === null) {
      return;
    }
    let findSelectedIndex = this.selectedItems.findIndex((i) => i.key === event.key);
    if (this.allowMultiSelect) {
      if (findSelectedIndex > -1) {
        this.selectedItems.splice(findSelectedIndex, 1);
      } else {
        let findItem = cloneDeep(this.backup.find((i) => i.key === event.key));
        if (findItem) {
          this.selectedItems.push(findItem);
        }
      }
    } else {
      let findItem = cloneDeep(this.backup.find((i) => i.key === event.key));
      if (findItem) {
        this.selectedItems = [findItem];
      }
    }
    this.updateSelection();
    this.onSelectItem.emit(cloneDeep(this.selectedItems));
    if (this.closeOnSelect && !this.allowMultiSelect) {
      this.dropdownRef.closeDropdown();
    }
  }

  updateSelection() {
    this.menuItems.forEach((item, index) => {
      if (this.selectedItems.find((a) => item.key === a.key)) {
        this.menuItems[index].selected = true;
      } else {
        this.menuItems[index].selected = false;
      }
    });
    this.backup.forEach((item, index) => {
      if (this.selectedItems.find((a) => item.key === a.key)) {
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
      this.menuItems = cloneDeep(
        this.backup.filter(
          (i) => i.value.toLowerCase().indexOf(needle.toLowerCase()) > -1 || i.stickontop,
        ),
      );
      if (!this.menuItems.length) {
        this.menuItems = [
          {
            key: null,
            value: 'No matches found.',
            selected: false,
            cssLabelClass: undefined,
          },
        ];
      }
    } else {
      this.menuItems = cloneDeep(this.backup);
    }
  }

  onOpen(event) {
    this.isOpen = true;
    this.onOpenSelector.emit('open');
  }
  onClose(event) {
    this.isOpen = false;
    // Setting search input to empty string
    this.dropdownRef.setSearchText('');
    // Thus reset the value
    this.menuItems = cloneDeep(this.backup);

    const compare1 = this.selectedItems.filter(
      (i) => this._selectedItemsBackup.findIndex((b) => b.key === i.key) === -1,
    );
    const compare2 = this._selectedItemsBackup.filter(
      (i) => this.selectedItems.findIndex((b) => b.key === i.key) === -1,
    );
    if (compare1.length !== 0 || compare2.length !== 0) {
      this.onCloseSelector.emit(cloneDeep(this.selectedItems));
    }
  }

  openDropdown() {
    if (this.allowUpdate) {
      this.dropdownRef.openDropdown();
    }
  }

  closeDropdown() {
    this.dropdownRef.closeDropdown();
  }

  closeSelector() {}
}
