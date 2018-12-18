import { Highlightable } from '@angular/cdk/a11y';
import { Component, HostBinding, Input, OnInit, ViewChildren } from '@angular/core';

@Component({
  selector: 'list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.less'],
})
export class ListItemComponent implements Highlightable {
  @Input() item;
  @Input() disabled = false;
  private _isActive = false;

  setActiveStyles() {
    this._isActive = true;
  }

  setInactiveStyles() {
    this._isActive = false;
  }

  getLabel() {
    return this.item;
  }
}
