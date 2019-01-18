import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { combineLatest, of as ObservableOf } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { SelectDropdownComponent } from './../../widgets/select-dropdown/select-dropdown.component';

export type TypeaheadDropdownItem = {
  key: string;
  value: string;
  selected: boolean;
};

export type TypeaheadDatasourceFunction = (string) => Observable<TypeaheadDropdownItem[]>;

@Component({
  selector: 'f8-typeahead-selector',
  templateUrl: './typeahead-selector.component.html',
  styleUrls: ['./typeahead-selector.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeaheadSelectorComponent implements OnInit {
  @ViewChild('dropdown') dropdownRef: SelectDropdownComponent;

  // This should be a function instance that returns
  // observable of formatted data for the dropdown
  @Input('dataSource') dataSource: TypeaheadDatasourceFunction;
  @Input('headerText') headerText: string = 'Default Header Text';
  @Input('noValueLabel') noValueLabel: string = 'None';
  @Input('allowUpdate') allowUpdate: boolean = true;
  @Input('allowMultiSelect') allowMultiSelect: boolean = false;
  @Input('closeOnSelect') closeOnSelect: boolean = true;
  @Input('selectedItems') set selectedItemsSetter(items: TypeaheadDropdownItem[]) {
    // If selected items are not an array
    // then return an empty array
    // i.e. nothing is selected
    if (!Array.isArray(items)) {
      items = [];
    }

    // If multip selection for this component is off
    // then take only one i.e. first element from items
    if (!this.allowMultiSelect && items.length) {
      this.selectedItems = [items[0]];
    } else {
      this.selectedItems = items;
    }
    this._selectedItems = [...this.selectedItems];
    this.selectedItemsBs.next(this._selectedItems);
  }
  @Input('itemTruncate') itemTruncate: number = 500;
  @Input('toggleTruncate') toggleTruncate: number = 500;

  @Output() readonly onSelectItem: EventEmitter<any[]> = new EventEmitter();
  @Output() readonly onOpenSelector: EventEmitter<any> = new EventEmitter();
  @Output() readonly onCloseSelector: EventEmitter<any[]> = new EventEmitter();

  private searchTermObs: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private selectedItemsBs: BehaviorSubject<TypeaheadDropdownItem[]> = new BehaviorSubject<
    TypeaheadDropdownItem[]
  >([]);
  private selectedItemsObs = this.selectedItemsBs
    .asObservable()
    .pipe(filter((i) => Array.isArray(i)));

  // this is only used for storing the data temporarily
  // not for visualization
  // we use the data coming in from the input for vusualization
  private _selectedItems: TypeaheadDropdownItem[] = [];

  // This is used to render the UI
  selectedItems: TypeaheadDropdownItem[] = [];

  private searchValue: string = '';
  searching: boolean = false;
  isOpen: boolean = false;

  menuItems: Observable<TypeaheadDropdownItem[]> = this.searchTermObs.asObservable().pipe(
    tap((term) => (this.searchValue = term)),
    switchMap((term) => {
      if (typeof this.dataSource === 'function' && term !== '') {
        return combineLatest(this.dataSource(term), this.selectedItemsObs).pipe(
          map(([items, selectedItems]) => this.updateSelection(items, selectedItems)),
          tap((v) => (this.searching = false)),
          catchError((err) => {
            this.searching = false;
            return ObservableOf([]);
          }),
        );
      } else {
        return ObservableOf([]);
      }
    }),
  );

  ngOnInit() {}

  updateSelection(
    items: TypeaheadDropdownItem[],
    selectedItems: TypeaheadDropdownItem[],
  ): TypeaheadDropdownItem[] {
    const selectedItemsIds = selectedItems.map((i) => i.key);
    items.forEach((item) => {
      item.selected = selectedItemsIds.indexOf(item.key) > -1;
    });
    return items;
  }

  onSelect(event: TypeaheadDropdownItem) {
    if (event.key === null) {
      return;
    }
    if (!this.allowMultiSelect) {
      // empty the array and put the item clicked
      this._selectedItems = [event];
    } else {
      // find the index of the clicked item in the selected list
      const index = this._selectedItems.findIndex((i) => i.key === event.key);
      // if the item clickd is already there then remove it
      if (index > -1) {
        this._selectedItems.splice(index, 1);
      } else {
        // enter the item in the array
        this._selectedItems.push(event);
      }
    }
    this.selectedItemsBs.next(this._selectedItems);
    this.onSelectItem.emit(this._selectedItems);
    if (this.closeOnSelect && !this.allowMultiSelect) {
      this.dropdownRef.closeDropdown();
    }
  }

  onSearch(event: string) {
    // Search on atleast 3 char or numeric
    if (event.trim().length >= 3 || !isNaN(parseInt(event.trim()))) {
      this.searchTermObs.next(event.trim());
      this.searching = true;
    } else {
      this.searchTermObs.next('');
    }
  }

  onOpen(event) {
    this.isOpen = true;
    this.onOpenSelector.emit();
  }

  onClose(event) {
    this.isOpen = false;
    this.dropdownRef.setSearchText('');
    // Empty the search results on close
    this.searchTermObs.next('');
    this.onCloseSelector.emit(this._selectedItems);
  }
}
