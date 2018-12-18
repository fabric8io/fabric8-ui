import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { animate, state, style, transition, trigger } from '@angular/animations';

import { Dialog } from './dialog';

@Component({
  animations: [
    trigger('modalState', [
      state(
        'inactive',
        style({
          opacity: '0',
          transform: 'translateY(-50%)',
        }),
      ),
      state(
        'active',
        style({
          opacity: '1',
          transform: 'translateY(0)',
        }),
      ),
      transition('inactive <=>active', animate('500ms ease-in')),
    ]),
    trigger('modalOverlay', [
      state(
        'inactive',
        style({
          background: 'transparent',
        }),
      ),
      state(
        'active',
        style({
          background: 'rgba(0,0,0,0.4)',
        }),
      ),
      transition('inactive <=>active', animate('500ms ease-in')),
    ]),
  ],
  selector: 'alm-dialog',
  styleUrls: ['./dialog.component.less'],
  templateUrl: './dialog.component.html',
})
export class DialogComponent implements OnInit {
  @Input() dialog: Dialog;

  @Output('pfDialogClick') onClick = new EventEmitter();

  modalFadeIn: Boolean = false;
  modalState: string = 'inactive';

  constructor() {}

  ngOnInit(): void {
    //need to fade in the modal
    this.modalFadeIn = true;
    setTimeout(() => (this.modalState = 'active'));
  }

  closeModal() {
    this.btnClick(0);
  }

  btnClick(val: number): void {
    this.modalState = 'inactive';
    // 300ms this much time the animation takes to close the modal
    setTimeout(() => {
      this.onClick.emit(val);
      this.modalFadeIn = false;
    }, 300);
  }

  @HostListener('window:keydown', ['$event'])
  onActionKeyPress(event: any): void {
    let currentDefaultIndex = this.dialog.actionButtons.findIndex((i) => i.default);
    this.dialog.actionButtons[currentDefaultIndex].default = false;
    let len = this.dialog.actionButtons.length;
    if (event.keyCode == 37) {
      // Left arrow
      let newDefaultIndex = (currentDefaultIndex - 1 + len) % len;
      this.dialog.actionButtons[newDefaultIndex].default = true;
    } else if (event.keyCode == 39) {
      // Right arrow
      let newDefaultIndex = (currentDefaultIndex - 1 + len) % len;
      this.dialog.actionButtons[newDefaultIndex].default = true;
    } else if (event.keyCode == 13) {
      // Enter
      this.btnClick(this.dialog.actionButtons[currentDefaultIndex].value);
    } else if (event.keyCode == 27) {
      // Esc key
      this.btnClick(0);
    }
  }
}
