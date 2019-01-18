import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'alm-slide-out-panel',
  styleUrls: ['./slide-out-panel.component.less'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translateX(0)',
        }),
      ),
      state(
        'out',
        style({
          transform: 'translateX(100%)',
        }),
      ),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('500ms ease-in-out')),
    ]),
  ],
  templateUrl: './slide-out-panel.component.html',
})
export class SlideOutPanelComponent implements OnInit, AfterViewInit {
  @Input() panelState: string;

  @Input() itemName: string;

  @Input() itemIcon: string;

  @Output() panelStateChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {}

  closeDetails(): void {
    this.panelState = 'out';
    this.panelStateChange.emit(this.panelState);
  }
}
