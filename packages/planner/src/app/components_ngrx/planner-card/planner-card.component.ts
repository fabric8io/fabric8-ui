import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardConfig } from 'patternfly-ng/card';
import { WorkItemUI } from './../../models/work-item';

@Component({
  selector: 'f8-planner-card',
  templateUrl: './planner-card.component.html',
  styleUrls: ['./planner-card.component.less'],
})
export class PlannerCardComponent {
  @Input() workItem: WorkItemUI;
  @Output() readonly onCardClick = new EventEmitter();
  @Output() readonly onTitleClick = new EventEmitter();

  private config: CardConfig = {
    noPadding: true,
    topBorder: false,
    titleBorder: false,
  };

  cardClick(workItem: WorkItemUI, event) {
    event.stopPropagation();
    this.onCardClick.emit(workItem);
  }

  titleClick(workItem: WorkItemUI, event) {
    event.stopPropagation();
    this.onTitleClick.emit(workItem);
  }
}
