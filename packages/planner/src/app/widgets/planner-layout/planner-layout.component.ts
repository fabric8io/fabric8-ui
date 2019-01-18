import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'alm-planner-layout',
  templateUrl: './planner-layout.component.html',
  styleUrls: ['./planner-layout.component.less'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          width: '50px',
        }),
      ),
      state(
        'out',
        style({
          width: '320px',
        }),
      ),
      transition('in <=> out', animate('400ms ease-in-out')),
    ]),
    trigger('slideInOutContent', [
      state(
        'out',
        style({
          marginLeft: '50px',
        }),
      ),
      state(
        'in',
        style({
          marginLeft: '320px',
        }),
      ),
      transition('in <=> out', animate('400ms ease-in-out')),
    ]),
  ],
})
export class PlannerLayoutComponent implements OnInit {
  @Input() itemName: string;
  @Input() itemIcon: string;
  @Input() sidePanelContent: TemplateRef<any>;
  @Input() sectionContent: TemplateRef<any>;

  @Output() readonly sidePanelStateChange = new EventEmitter<string>();

  contentHide: Boolean = false;
  sidePanelState: string = 'out';

  constructor() {}

  ngOnInit(): void {}

  getCurrentState() {
    return this.sidePanelState;
  }

  toggleSidePanel(): void {
    this.sidePanelState = this.sidePanelState === 'in' ? 'out' : 'in';
    this.sidePanelStateChange.emit(this.sidePanelState);
  }
}
