import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { WorkItemUI } from './../../models/work-item';

@Component({
  selector: 'work-item-preview-panel',
  templateUrl: './work-item-preview-panel.component.html',
  styleUrls: ['./work-item-preview-panel.component.less'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translateX(0px)',
          left: 'auto',
        }),
      ),
      state(
        'out',
        style({
          transform: 'translateX(100%)',
          left: '100%',
        }),
      ),
      transition('in => out', animate('200ms ease-in-out')),
      transition('out => in', animate('200ms ease-in-out')),
    ]),
  ],
})
export class WorkItemPreviewPanelComponent implements OnInit {
  @Input() context: string = 'list';

  @Output('onOpen') readonly onOpen: EventEmitter<any> = new EventEmitter();
  @Output('onClose') readonly onClose: EventEmitter<any> = new EventEmitter();

  private panelState: 'in' | 'out' = 'out';
  private workItem: WorkItemUI = null;

  ngOnInit() {}

  open(workItem: WorkItemUI) {
    if (workItem) {
      this.workItem = workItem;
      if (this.panelState === 'out') {
        this.panelState = 'in';
        this.onOpen.emit();
      }
    }
  }

  close() {
    this.panelState = 'out';
    this.workItem = null;
    this.onClose.emit();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyEvent(event: any) {
    event = event || window.event;
    // for ESC key handling
    if (event.keyCode == 27) {
      this.close();
    }
  }
}
