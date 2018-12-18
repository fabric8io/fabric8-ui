import { Component, Input } from '@angular/core';
import { User } from 'ngx-login-client';

@Component({
  selector: 'f8-assignee',
  templateUrl: './assignee.component.html',
  styleUrls: ['./assignee.component.less'],
})
export class AssigneesComponent {
  private assignees: User[] = [];

  @Input() truncateAfter: number;
  @Input() showFullName: boolean;
  @Input('assignees') set assigneeInput(val) {
    this.assignees = val;
  }
  @Input() overlapAvatar: boolean = false;

  constructor() {}
}
