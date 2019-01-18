import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { cloneDeep } from 'lodash';
import { LabelModel, LabelUI } from './../../models/label.model';
import { LabelService } from './../../services/label.service';
import { SelectDropdownComponent } from './../../widgets/select-dropdown/select-dropdown.component';

// ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../../app/states/app.state';
import * as LabelActions from './../../actions/label.actions';

@Component({
  selector: 'label-selector',
  templateUrl: './label-selector.component.html',
  styleUrls: ['./label-selector.component.less'],
})
export class LabelSelectorComponent implements OnInit {
  @ViewChild('labelname') labelnameInput: ElementRef;
  @ViewChild('dropdown') dropdownRef: SelectDropdownComponent;
  @Input('allLabels') set allLabelsSetter(labels: LabelUI[]) {
    this.allLabels = [...labels];
    this.createDisabled = true;
    this.backup = cloneDeep(
      this.allLabels.map((label: LabelUI) => {
        return {
          id: label.id,
          color: label.backgroundColor,
          border: label.borderColor,
          name: label.name,
          selected: false,
        };
      }),
    );
    if (this.searchValue.length) {
      this.labels = cloneDeep(this.backup.filter((i) => i.name.indexOf(this.searchValue) > -1));
    } else {
      this.labels = cloneDeep(this.backup);
    }
    if (this.labelnameInput) {
      this.labelnameInput.nativeElement.value = '';
      this.labelnameInput.nativeElement.focus();
    }
    this.updateSelection();
  }

  @Input('selectedLabels') set selectedLabelsSetter(labels: LabelUI[]) {
    this.selectedLabels = cloneDeep(labels);
    this._selectedLabelsBackup = cloneDeep(labels);
    this.updateSelection();
  }

  @Input() allowUpdate: boolean = true;

  @Output() readonly onSelectLabel: EventEmitter<LabelUI[]> = new EventEmitter();
  @Output() readonly onOpenSelector: EventEmitter<any> = new EventEmitter();
  @Output() readonly onCloseSelector: EventEmitter<LabelUI[]> = new EventEmitter();

  private activeAddLabel: boolean = false;
  private backup: any[] = [];
  private colorPickerActive: boolean = false;
  private colors: any[] = [];
  private createDisabled: boolean = true;
  private labels: any[] = [];
  private newSelectedColor: any = {};
  private searchValue: string = '';
  private allLabels: LabelUI[] = [];
  private selectedLabels: LabelUI[] = [];
  private _selectedLabelsBackup: LabelUI[] = [];

  constructor(private labelService: LabelService, private store: Store<AppState>) {}

  ngOnInit() {
    this.colors = [
      { color: '#fbdebf', border: '#f39d3c' },
      { color: '#f7bd7f', border: '#f39d3c' },
      { color: '#fbeabc', border: '#f39d3c' },
      { color: '#f9d67a', border: '#f39d3c' },
      { color: '#e4f5bc', border: '#ace12e' },
      { color: '#cfe7cd', border: '#6ec664' },
      { color: '#9ecf99', border: '#6ec664' },
      { color: '#bedee1', border: '#3a9ca6' },
      { color: '#7dbdc3', border: '#3a9ca6' },
      { color: '#beedf9', border: '#35caed' },
      { color: '#7cdbf3', border: '#35caed' },
      { color: '#c7bfff', border: '#8461f7' },
      { color: '#a18fff', border: '#8461f7' },
      { color: '#ededed', border: '#bbbbbb' },
      { color: '#d1d1d1', border: '#bbbbbb' },
    ];
    this.newSelectedColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  onSelect(event: any) {
    let findSelectedIndex = this.selectedLabels.findIndex((i) => i.id === event.id);
    if (findSelectedIndex > -1) {
      this.selectedLabels.splice(findSelectedIndex, 1);
    } else {
      let findLabel = cloneDeep(this.allLabels.find((i) => i.id === event.id));
      if (findLabel) {
        this.selectedLabels.push(findLabel);
      }
    }
    this.updateSelection();
    this.onSelectLabel.emit(cloneDeep(this.selectedLabels));
  }

  updateSelection() {
    this.labels.forEach((label, index) => {
      if (this.selectedLabels.find((l) => label.id === l.id)) {
        this.labels[index].selected = true;
      } else {
        this.labels[index].selected = false;
      }
    });
    this.backup.forEach((label, index) => {
      if (this.selectedLabels.find((l) => label.id === l.id)) {
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
      this.labels = cloneDeep(
        this.backup.filter(
          (i) => i.name.toLocaleLowerCase().indexOf(needle.toLocaleLowerCase()) > -1,
        ),
      );
    } else {
      this.labels = cloneDeep(this.backup);
    }
  }

  clickOnAddLabel() {
    this.newSelectedColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.activeAddLabel = true;
  }

  closeAddLabel() {
    this.activeAddLabel = false;
  }

  toggleColorPicker() {
    this.colorPickerActive = !this.colorPickerActive;
  }

  selectColor(color: any) {
    this.newSelectedColor = color;
  }
  createLabel(name: any) {
    if (name.trim() === '' || this.createDisabled) {
      return;
    }
    this.createDisabled = true;
    let labelPayload: LabelModel = {
      attributes: {
        name: name,
        'background-color': this.newSelectedColor.color,
        'border-color': this.newSelectedColor.border,
      },
      type: 'labels',
    };
    this.store.dispatch(new LabelActions.Add(labelPayload));
  }

  onOpen(event) {
    this.onOpenSelector.emit('open');
  }

  onClose(event) {
    // Setting search input to empty string
    this.dropdownRef.setSearchText('');
    // Thus reset the value
    this.labels = cloneDeep(this.backup);

    const compare1 = this.selectedLabels.filter(
      (i) => this._selectedLabelsBackup.findIndex((b) => b.id === i.id) === -1,
    );
    const compare2 = this._selectedLabelsBackup.filter(
      (i) => this.selectedLabels.findIndex((b) => b.id === i.id) === -1,
    );
    if (compare1.length !== 0 || compare2.length !== 0) {
      this.onCloseSelector.emit(cloneDeep(this.selectedLabels));
    }
  }

  openDropdown() {
    this.dropdownRef.openDropdown();
  }

  closeDropdown() {
    this.dropdownRef.closeDropdown();
  }

  onAddLabelInput(val) {
    if (val.trim().length === 0 && val.length) {
      this.labelnameInput.nativeElement.value = '';
      this.createDisabled = true;
    } else {
      this.createDisabled = false;
    }
  }
}
