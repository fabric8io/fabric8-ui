import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

import { AddWorkFlowService } from '../stack-details/add-work-flow.service';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'stack-recommendation',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './stack-recommendation.html',
  styleUrls: ['stack-recommendation.scss']
})

export class StackRecommendationComponent {

  @Input() headers;
  @Input() rows;
  @Input() clickable;

  @Output() customEvent = new EventEmitter();

  constructor(private addWorkFlowService: AddWorkFlowService) {

  }

  /* Add Workflow */
  eventHandler(row: any): void {
    this.customEvent.emit(row);
  }

  eventChangeHandler(row: any): void {
    this.customEvent.emit(row);
  }

}
