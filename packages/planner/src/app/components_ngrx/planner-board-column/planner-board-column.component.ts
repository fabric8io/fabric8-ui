import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'f8-planner-column',
  templateUrl: './planner-board-column.component.html',
  styleUrls: ['./planner-board-column.component.less'],
})
export class PlannerBoardColumnComponent {
  @Input() columnBody: TemplateRef<any>;
  @Input() itemCount: number;
  @Input() columnName: string;
}
