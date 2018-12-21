import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { sortBy } from 'lodash';

@Component({
  selector: 'table-config',
  templateUrl: './table-config.component.html',
  styleUrls: ['./table-config.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableConfigComponent {
  @Input() columns;
  @Output() readonly onMovetoAvailable: EventEmitter<any[]> = new EventEmitter();
  @Output() readonly onMovetoDisplay: EventEmitter<any[]> = new EventEmitter();
  isNoDisplayedAttributeSelected: Boolean = true;
  isNoAvailableAttributeSelected: Boolean = true;

  private isTableConfigOpen;

  /**
   * set selected prop true of checked column
   * @param event native event of checkbox
   * @param col column object
   */
  toggleCheckbox(event, col) {
    if (event.target.checked) {
      col.selected = true;
    } else {
      col.selected = false;
    }
    this.checkIfNoColumnSelected();
  }

  checkIfNoColumnSelected() {
    this.isNoAvailableAttributeSelected = true;
    this.isNoDisplayedAttributeSelected = true;
    this.columns
      .filter((col) => col.selected)
      .forEach((col) => {
        if (this.isNoAvailableAttributeSelected || this.isNoDisplayedAttributeSelected) {
          if (col.available === true) {
            this.isNoAvailableAttributeSelected = false;
          }
          if (col.display === true) {
            this.isNoDisplayedAttributeSelected = false;
          }
        }
      });
  }
  /**
   * set display property true of selected cols
   * shows these column in table
   */
  moveToDisplay() {
    this.columns
      .filter((col) => col.selected)
      .forEach((col) => {
        if (col.display === true) {
          return;
        }
        col.selected = false;
        col.display = true;
        col.showInDisplay = true;
        col.available = false;
      });
    this.updateColumnIndex();
    this.onMovetoDisplay.emit(this.columns);
  }

  /**
   * set available property true and display property false of selected columns
   * dont show these col in table
   */
  moveToAvailable() {
    this.columns
      .filter((col) => col.selected)
      .forEach((col) => {
        if (col.available === true) {
          return;
        }
        col.selected = false;
        col.display = false;
        col.showInDisplay = false;
        col.available = true;
      });
    this.updateColumnIndex();
    this.onMovetoAvailable.emit(this.columns);
  }

  /**
   * update the index of column with prop display: true
   * set index undefined for col with prop display: false
   *  i.e. hidden columns
   */
  updateColumnIndex() {
    this.checkIfNoColumnSelected();
    let index = 0;
    this.columns.forEach((col) => {
      if (col.display === true) {
        col.index = index + 1;
        index += 1;
      } else {
        col.index = undefined;
      }
    });
    this.columns = sortBy(this.columns, 'index');
  }

  // toggle dropdown based on isTableConfigOpen
  tableConfigChange(value: boolean) {
    this.isTableConfigOpen = value;
  }

  tableConfigToggle(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isTableConfigOpen = false;
  }

  // close dropdown when clicked outside
  clickOut() {
    if (this.isTableConfigOpen) {
      this.isTableConfigOpen = false;
    }
  }
}
