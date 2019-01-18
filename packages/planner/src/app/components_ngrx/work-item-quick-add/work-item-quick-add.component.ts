import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { filter } from 'rxjs/operators';
import { WorkItem, WorkItemRelations, WorkItemService } from '../../models/work-item';
import { WorkItemTypeUI } from '../../models/work-item-type';
import { IterationUI } from './../../models/iteration.model';
import { PermissionQuery } from './../../models/permission.model';
import { WorkItemQuery } from './../../models/work-item';

// ngrx stuff
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as WorkItemActions from './../../actions/work-item.actions';
import { AppState } from './../../states/app.state';

@Component({
  selector: 'alm-work-item-quick-add',
  templateUrl: './work-item-quick-add.component.html',
  styleUrls: ['./work-item-quick-add.component.less'],
})
export class WorkItemQuickAddComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  @ViewChild('quickAddTitle') qaTitle: any;
  @ViewChild('quickAddDesc') qaDesc: any;
  @ViewChildren('quickAddTitle', { read: ElementRef }) qaTitleRef: QueryList<ElementRef>;
  @ViewChild('quickAddElement') quickAddElement: ElementRef;
  @ViewChild('inlinequickAddElement') inlinequickAddElement: ElementRef;

  @Input() parentWorkItemId: string = null;
  @Input() parentWorkItemIterationId: string = null;
  @Input() workItemTypes: WorkItemTypeUI[] = [];
  @Input() selectedType: WorkItemTypeUI = null;
  @Input() selectedIteration: IterationUI = null;
  @Input() wilistview: string = 'wi-list-view';

  @Output() readonly onStartCreateWI: EventEmitter<any> = new EventEmitter();

  error: any = false;
  workItem: WorkItemService;
  validTitle: boolean = false;
  linkObject: object;
  addDisabled: Observable<boolean> = this.permissionQuery.isAllowedToAdd();
  workItemTitle = new FormControl('');

  // Board view specific
  initialDescHeight: number = 0;
  initialDescHeightDiff: number = 0;
  descHeight: any = '27px';
  descResize: any = 'none';
  showQuickAdd: boolean;
  createId: number = 0;
  eventListeners: any[] = [];
  blockAdd: boolean = false;
  infotipSource = this.store.pipe(
    select('planner'),
    select('infotips'),
  );

  constructor(
    private logger: Logger,
    private renderer: Renderer2,
    private store: Store<AppState>,
    private workItemQuery: WorkItemQuery,
    private permissionQuery: PermissionQuery,
  ) {}

  ngOnInit(): void {
    this.createWorkItemObj();

    // This is board view specific
    this.showQuickAdd = false;

    // listen for item added
    this.eventListeners.push(
      this.workItemQuery
        .getWorkItems()
        .pipe(filter((items) => !!items.length))
        .subscribe((items) => {
          // const addedItem = items.find(item => item.createId === this.createId);
          this.resetQuickAdd();
        }),
    );
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.eventListeners.forEach((e) => {
      e.unsubscribe();
    });
  }

  setTypeContext(type: any) {
    this.logger.log('Force set type context on quick add component to ' + type.attributes.name);
    this.selectedType = type;
  }

  createWorkItemObj() {
    this.workItem = new WorkItem() as WorkItemService;
    this.workItem.attributes = new Map<string, string | number>();
    this.workItem.relationships = new WorkItemRelations();
    this.workItem.type = 'workitems';
  }

  ngAfterViewInit() {
    this.qaTitleRef.changes.subscribe((item) => {
      if (item.length) {
        this.qaTitle.nativeElement.focus();
      }
    });
  }

  ngAfterViewChecked() {
    if (this.quickAddElement) {
      let quickaddWdth: number = 0;
      if (document.getElementsByClassName('f8-wi-list__quick-add').length > 0) {
        quickaddWdth = (document.getElementsByClassName('f8-wi-list__quick-add')[0] as HTMLElement)
          .offsetWidth;
      }
      let targetWidth: number = quickaddWdth + 20;
      if (this.quickAddElement.nativeElement.classList.contains('f8-quick-add-inline')) {
        this.renderer.setStyle(this.quickAddElement.nativeElement, 'max-width', targetWidth + 'px');
      }
    }
  }

  selectType(event: any, type: WorkItemTypeUI) {
    if (event) {
      event.preventDefault();
    }
    this.logger.log('Selected type ' + type.name + ' for quick add.');
    this.selectedType = type;
    this.qaTitle.nativeElement.focus();
  }

  save(event: any = null, openStatus: boolean = false): void {
    if (event) {
      event.preventDefault();
    }
    // Do we have a real title?
    // If yes, trim; if not, reassign it as a (blank) string.
    this.workItem.attributes['system.title'] = !!this.workItem.attributes['system.title']
      ? this.workItem.attributes['system.title'].trim()
      : '';

    // Same treatment as title, but this is more important.
    // As we're validating title in the next step
    // But passing on description as is (causing data type issues)
    this.workItem.attributes['system.description'] = !!this.workItem.attributes[
      'system.description'
    ]
      ? this.workItem.attributes['system.description'].trim()
      : '';

    // Set the default work item type
    this.workItem.relationships.baseType = {
      data: {
        id: this.selectedType ? this.selectedType.id : 'testtypeid',
        type: 'workitemtypes',
      },
    };

    // Setting state value from selected work item type
    // This line can be removed when space template backend is in
    // The backend will take care of setting the default state to
    // a newly create work item
    this.workItem.attributes['system.state'] = this.selectedType.fields[
      'system.state'
    ].type.values[0];

    // Set the default iteration for new work item
    if (this.selectedIteration) {
      this.workItem.relationships.iteration = {
        data: {
          id: this.selectedIteration.id,
          type: 'iterations',
        },
      };
    }

    // Set the parent iteration for new child work item
    if (this.parentWorkItemIterationId) {
      this.workItem.relationships.iteration = {
        data: {
          id: this.parentWorkItemIterationId,
          type: 'iterations',
        },
      };
    }

    this.createId = new Date().getTime();

    if (this.workItem.attributes['system.title']) {
      this.blockAdd = true;
      this.onStartCreateWI.emit(this.parentWorkItemId);
      this.store.dispatch(
        new WorkItemActions.Add({
          createId: this.createId,
          workItem: this.workItem,
          parentId: this.parentWorkItemId,
          openDetailPage: openStatus,
        }),
      );
      if (this.wilistview === 'wi-query-view') {
        this.workItemTitle.setValue('');
        this.resetQuickAdd();
      }
    } else {
      this.blockAdd = false;
      this.error = 'Title can not be empty.';
    }
  }

  checkTitle(): void {
    if (
      this.workItem.attributes['system.title'] &&
      this.workItem.attributes['system.title'].trim()
    ) {
      this.validTitle = true;
    } else {
      this.validTitle = false;
    }
  }

  resetQuickAdd(): void {
    this.validTitle = false;
    this.createWorkItemObj();
    this.showQuickAdd = true;
    this.descHeight = this.initialDescHeight ? this.initialDescHeight : '26px';
    this.blockAdd = false;
    if (this.qaTitle) {
      this.qaTitle.nativeElement.focus();
    }
  }

  preventDef(event: any) {
    event.preventDefault();
  }

  // This board view specific
  checkDesc(): void {
    if (!this.initialDescHeight) {
      this.initialDescHeight = this.qaDesc.nativeElement.offsetHeight;
      this.initialDescHeightDiff = this.initialDescHeight - this.qaDesc.nativeElement.scrollHeight;
    }
    this.descHeight = this.qaDesc.nativeElement.scrollHeight + this.initialDescHeightDiff;
  }

  getInfotipText(id: string) {
    return this.infotipSource.pipe(
      select((s) => s[id]),
      select((i) => (i ? i['en'] : id)),
    );
  }
}
