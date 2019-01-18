import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { EventUI } from '../../models/event.model';

@Component({
  selector: 'work-item-event',
  templateUrl: './work-item-event.component.html',
  styleUrls: ['./work-item-event.component.less'],
})
export class WorkItemEventComponent implements OnInit {
  @Input('event') set Event(event: EventUI) {
    this.event = event;
    this.getTitle();
    switch (event.type) {
      case null:
        this.singleValueChange();
        break;

      case 'areas':
        this.areasAndIteration();
        break;

      case 'users':
        this.users();
        break;

      case 'iterations':
        this.areasAndIteration();
        break;

      case 'labels':
        this.labels();
        break;

      case 'workitemtypes':
        this.workitemtypes();
        break;

      default:
        // Do not remove this console. It outputs the unknown events
        console.log('Unknown event', event);
    }
  }

  private event: EventUI;
  private intermediateText: string;
  private title: string;
  private toText: string | null = 'to';
  private textType: string;

  ngOnInit() {}

  getTitle() {
    if (this.event.name.indexOf('system') > -1) {
      this.title = this.event.name.slice(this.event.name.indexOf('.') + 1);
    } else {
      this.title = this.event.name;
    }
  }

  singleValueChange() {
    if (this.title === 'description') {
      this.textType = 'description';
    } else {
      this.intermediateText = 'changed the ' + this.title + ' from';
      this.textType = 'attribute';
    }
  }

  areasAndIteration() {
    this.intermediateText = 'moved this work item to ' + this.title;
    this.toText = 'from ' + this.title;
    this.textType = 'relationship';
  }

  users() {
    if (this.event.oldValueRelationships.length === 0) {
      if (
        this.event.newValueRelationships.length === 1 &&
        this.event.newValueRelationships[0].id === this.event.modifierId
      ) {
        this.intermediateText = 'self assigned this workitem';
        this.toText = null;
        this.event.newValueRelationshipsObs = [];
      } else {
        this.intermediateText = 'assigned this work item to';
        this.toText = null;
      }
    } else if (this.event.newValueRelationships.length === 0) {
      this.intermediateText = 'unassigned';
      this.toText = ' ';
    } else {
      this.intermediateText = 'assigned';
      this.toText = 'and unassgined';
    }
    this.textType = 'assignee';
  }

  labels() {
    if (this.event.oldValueRelationships.length === 0) {
      this.intermediateText = 'added ';
      this.toText = ' label';
    } else if (this.event.newValueRelationships.length === 0) {
      this.intermediateText = 'removed the label ';
      this.toText = ' ';
    } else {
      this.intermediateText = 'added the label ';
      this.toText = ' and removed the label ';
    }
    this.textType = 'label';
  }

  workitemtypes() {
    this.intermediateText = 'changed the workitem type from';
    this.textType = 'typeChange';
  }
}
