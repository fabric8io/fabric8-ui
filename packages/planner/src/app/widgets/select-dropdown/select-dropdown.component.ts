import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'f8-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDropdownComponent implements OnInit {
  @Input() headerText: string = 'This is default header';
  @Input() toggleButtonRef: TemplateRef<any>;
  @Input() dropdownItem: TemplateRef<any>;
  @Input() dropdownFooter: TemplateRef<any>;
  @Input() menuItems: any[] = [];
  @Input() showSearch: boolean = false;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;

  @Output() readonly onSelect: EventEmitter<any> = new EventEmitter();
  @Output() readonly onSearch: EventEmitter<any> = new EventEmitter();
  @Output() readonly onOpen: EventEmitter<any> = new EventEmitter();
  @Output() readonly onClose: EventEmitter<any> = new EventEmitter();

  @ViewChild('searchInput') searchInput: ElementRef;

  constructor() {}

  private displayDropdown: boolean = false;

  ngOnInit() {}

  openDropdown() {
    if (!this.disabled) {
      this.loading = false;
      this.displayDropdown = true;
      if (this.searchInput) {
        setTimeout(() => this.searchInput.nativeElement.focus());
      }
      this.onOpen.emit('open');
    }
  }

  closeDropdown() {
    this.displayDropdown = false;
    this.onClose.emit('close');
  }

  selectItem(item: any) {
    this.onSelect.emit(item);
  }

  searchItem(text: string) {
    if (!text.trim()) {
      this.loading = false;
    }
    this.onSearch.emit(text);
  }

  clickOut() {
    if (this.displayDropdown) {
      this.closeDropdown();
    }
  }

  setSearchText(text: string) {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = text;
    }
  }
}
