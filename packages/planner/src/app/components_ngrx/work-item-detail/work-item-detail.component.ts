import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'ngx-login-client';
import { MarkdownComponent } from 'ngx-widgets';
import { combineLatest, Observable } from 'rxjs';
import { AreaUI } from './../../models/area.model';
import { LabelQuery, LabelUI } from './../../models/label.model';
import { UserQuery, UserUI } from './../../models/user';
import { WorkItemTypeQuery } from './../../models/work-item-type';
import { UrlService } from './../../services/url.service';
import { InlineInputComponent } from './../../widgets/inlineinput/inlineinput.component';

// ngrx stuff
import { Store } from '@ngrx/store';
import { filter, map, switchMap } from 'rxjs/operators';
import { CommonSelectorUI } from '../../models/common.model';
import * as DetailWorkItemActions from './../../actions/detail-work-item.actions';
import * as WorkItemActions from './../../actions/work-item.actions';
import { SpaceQuery } from './../../models/space';
import { WorkItemQuery, WorkItemUI } from './../../models/work-item';
import { WorkItemService } from './../../services/work-item.service';
import { AppState } from './../../states/app.state';

@Component({
  selector: 'work-item-detail',
  templateUrl: './work-item-detail.component.html',
  styleUrls: ['./work-item-detail.component.less'],
  providers: [AuthenticationService],
})
export class WorkItemDetailComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('detailHeader') detailHeader: ElementRef;
  @ViewChild('detailContent') detailContent: ElementRef;
  @ViewChild('inlineInput') inlineInput: InlineInputComponent;
  @ViewChild('descMarkdown') descMarkdown: MarkdownComponent;

  private spaceSource = this.spaceQuery.getCurrentSpace.pipe(filter((s) => !!s));

  public labelSource = this.labelQuery.getLables();
  public areaSource: Observable<CommonSelectorUI[]>;
  public iterationSource: Observable<CommonSelectorUI[]>;
  public workItemTypeSource: Observable<CommonSelectorUI[]>;
  private workItemStateSource: Observable<CommonSelectorUI[]>; // this goes in selector component

  public selectedAreas: Observable<CommonSelectorUI[]>; // this goes in selector component
  public selectedIterations: Observable<CommonSelectorUI[]>; // this goes in selector component
  public selectedWorkItemTypes: Observable<CommonSelectorUI[]>; // this goes in selector component
  public selectedWorkItemStates: Observable<CommonSelectorUI[]>; // this goes in selector component

  private collaboratorSource = this.userQuery.getCollaborators();

  private combinedSources = combineLatest(
    this.labelSource,
    this.collaboratorSource,
    this.workItemTypeQuery.getWorkItemTypes(),
  );

  @Input() context: string;
  @Input('workItem') set workItemInput(val: WorkItemUI) {
    if (val && val != null) {
      if (this.workItemSubscriber !== null) {
        this.workItemSubscriber.unsubscribe();
        this.workItemSubscriber = null;
      }
      this.detailContext = 'preview';
      const workItemNumber = val.number;
      this.setWorkItem(workItemNumber);
      this.listenToEsc = true;
    }
  }

  @Output() readonly closePreview: EventEmitter<any> = new EventEmitter();

  private workItem: WorkItemUI = null;
  private detailContext: 'preview' | 'detail' = 'preview';
  private eventListeners: any[] = [];
  private workItemSubscriber: any = null;
  private workItemStates: string[] = [];
  private collaborators: UserUI[] = [];
  private loggedIn: boolean = false;
  private titleCallback = null;
  private descCallback = null;
  private _areas: AreaUI[] = [];
  private areas: any[] = []; // this goes in selector component
  private labels: LabelUI[] = [];

  private loadingComments: boolean = true;
  private loadingTypes: boolean = false;
  private loadingStates: boolean = false;
  private loadingIteration: boolean = false;
  private loadingArea: boolean = false;
  private loadingLabels: boolean = false;
  private loadingAssignees: boolean = false;
  private loggedInUser: UserUI = null;
  private listenToEsc: boolean = false;
  private dynamicFormGroup: FormGroup;
  private dynamicFormDataArray: any;
  private dynamicKeyValueFields: { key: string; value: string | number | null; field: any }[];

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private auth: AuthenticationService,
    private renderer: Renderer2,
    private workItemService: WorkItemService,
    private sanitizer: DomSanitizer,
    private userQuery: UserQuery,
    private labelQuery: LabelQuery,
    private workItemQuery: WorkItemQuery,
    private workItemTypeQuery: WorkItemTypeQuery,
    private spaceQuery: SpaceQuery,
  ) {}

  ngOnInit() {
    const currentRoute = this.router.url;
    this.loggedIn = this.auth.isLoggedIn();
    if (currentRoute.includes('plan/detail/')) {
      this.detailContext = 'detail';
      const workItemNumber = currentRoute.split('plan/detail/')[1];
      this.setWorkItem(workItemNumber);
    }
  }

  ngOnDestroy() {
    this.eventListeners.forEach((e) => e.unsubscribe());
    if (this.workItemSubscriber !== null) {
      this.workItemSubscriber.unsubscribe();
      this.workItemSubscriber = null;
    }
    if (document.getElementsByTagName('body')[0].style.overflow === 'hidden') {
      document.getElementsByTagName('body')[0].removeAttribute('style');
    }
  }

  ngAfterViewChecked() {
    if (this.detailContext === 'detail') {
      if (this.detailHeader) {
        let HdrDivHeight: any = this.detailHeader.nativeElement.offsetHeight;
        let targetHeight: any = window.innerHeight - HdrDivHeight - 90;
        this.renderer.setStyle(this.detailContent.nativeElement, 'height', targetHeight + 'px');
      }
    }
    if (document.getElementsByTagName('body')) {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    }
  }

  setWorkItem(wiNumber: string | number) {
    this.iterationSource = this.workItemQuery.getIterationsForWorkItem(wiNumber);
    this.selectedIterations = this.getSelectedItems(this.iterationSource);
    this.areaSource = this.workItemQuery.getAreasForWorkItem(wiNumber);
    this.selectedAreas = this.getSelectedItems(this.areaSource);
    this.workItemTypeSource = this.workItemQuery.getTypesForWorkItem(wiNumber);
    this.selectedWorkItemTypes = this.getSelectedItems(this.workItemTypeSource);
    this.workItemStateSource = this.workItemQuery.getStatesForWorkItem(wiNumber);
    this.selectedWorkItemStates = this.getSelectedItems(this.workItemStateSource);

    this.workItemSubscriber = this.spaceSource
      .pipe(
        switchMap((s) => {
          return this.combinedSources;
        }),
        switchMap(([labels, collabs, type]) => {
          this.collaborators = collabs.filter((c) => !c.currentUser);
          this.loggedInUser = collabs.find((c) => c.currentUser);
          this.labels = labels.sort((l1, l2) =>
            l1.name.toLowerCase() > l2.name.toLowerCase() ? 1 : 0,
          );
          this.store.dispatch(
            new DetailWorkItemActions.GetWorkItem({
              number: wiNumber,
            }),
          );
          return this.workItemQuery.getWorkItem(wiNumber);
        }),
        filter((w) => w !== null),
      )
      .subscribe((workItem) => {
        if (
          this.detailContext === 'preview' &&
          this.descMarkdown &&
          this.workItem.id !== workItem.id
        ) {
          this.descMarkdown.deactivateEditor();
        }

        this.workItem = workItem;
        this.loadingAssignees = false;
        this.loadingArea = false;
        this.loadingIteration = false;
        this.loadingLabels = false;
        this.loadingTypes = false;
        this.loadingStates = false;

        // init dynamic form
        if (this.workItem.type) {
          this.eventListeners.push(
            this.workItem.typeObs.subscribe((type) => {
              this.dynamicKeyValueFields = type.dynamicfields.map((item) => {
                return {
                  key: item,
                  value: this.workItem.dynamicfields[item],
                  field: type.fields[item],
                };
              });
            }),
          );
        }

        // set title on update
        if (this.titleCallback !== null) {
          this.titleCallback(this.workItem.title);
          this.titleCallback = null;
        }

        // set desc on update
        if (this.descCallback !== null) {
          this.descCallback(
            this.workItem.description,
            this.sanitizer.bypassSecurityTrustHtml(this.workItem.descriptionRendered),
          );
          this.descCallback = null;
        }
      });
  }

  getSelectedItems(itemSource: Observable<CommonSelectorUI[]>): Observable<CommonSelectorUI[]> {
    return itemSource.pipe(
      map((items) => {
        return items.filter((i) => i.selected);
      }),
    );
  }

  closeDetail() {
    this.workItem = null;
    if (this.workItemSubscriber !== null) {
      this.workItemSubscriber.unsubscribe();
      this.workItemSubscriber = null;
    }
    if (this.detailContext === 'detail') {
      this.navigateBack();
    } else {
      if (this.inlineInput) {
        this.inlineInput.closeClick();
      }
      this.closePreview.emit();
    }
  }

  navigateBack() {
    if (this.urlService.getLastListOrBoard() === '') {
      this.router.navigate(['../..'], { relativeTo: this.route });
    } else {
      this.router.navigateByUrl(this.urlService.getLastListOrBoard());
    }
  }

  saveTitle(event) {
    const value = event.value.trim();
    this.titleCallback = event.callBack;
    if (value === '') {
      this.titleCallback(value, 'Empty title not allowed');
    } else if (this.workItem.title === value) {
      this.titleCallback(value);
    } else {
      let workItem = {} as WorkItemUI;
      workItem['version'] = this.workItem.version;
      workItem['link'] = this.workItem.link;
      workItem['id'] = this.workItem.id;
      workItem['title'] = value;
      this.store.dispatch(new WorkItemActions.Update(workItem));
    }
  }

  onChangeState(event: CommonSelectorUI[]) {
    if (event[0].value !== this.workItem.state) {
      this.loadingStates = true;
      let workItem = {} as WorkItemUI;
      workItem['version'] = this.workItem.version;
      workItem['link'] = this.workItem.link;
      workItem['id'] = this.workItem.id;
      workItem['state'] = event[0].value;
      this.store.dispatch(new WorkItemActions.Update(workItem));
    }
  }

  assignUser(users) {
    this.loadingAssignees = true;
    let workItem = {} as WorkItemUI;
    workItem['version'] = this.workItem.version;
    workItem['link'] = this.workItem.link;
    workItem['id'] = this.workItem.id;
    workItem['assignees'] = users.map((u) => u.id);
    this.store.dispatch(new WorkItemActions.Update(workItem));
  }

  areaUpdated(event) {
    const areaID = event[0].key;
    this.loadingArea = true;
    let workItem = {} as WorkItemUI;
    workItem['version'] = this.workItem.version;
    workItem['link'] = this.workItem.link;
    workItem['id'] = this.workItem.id;
    workItem['areaId'] = areaID;
    this.store.dispatch(new WorkItemActions.Update(workItem));
  }

  iterationUpdated(event) {
    const iterationID = event[0].key;
    this.loadingIteration = true;
    let workItem = {} as WorkItemUI;
    workItem['version'] = this.workItem.version;
    workItem['link'] = this.workItem.link;
    workItem['id'] = this.workItem.id;

    workItem['iterationId'] = iterationID;
    this.store.dispatch(new WorkItemActions.Update(workItem));
  }

  updateLabels(labels) {
    this.loadingLabels = true;
    let workItem = {} as WorkItemUI;
    workItem['version'] = this.workItem.version;
    workItem['link'] = this.workItem.link;
    workItem['id'] = this.workItem.id;

    workItem['labels'] = labels.map((l) => l.id);
    this.store.dispatch(new WorkItemActions.Update(workItem));
  }

  removeLable(label) {
    this.loadingLabels = true;
    let workItem = {} as WorkItemUI;
    workItem['version'] = this.workItem.version;
    workItem['link'] = this.workItem.link;
    workItem['id'] = this.workItem.id;

    workItem['labels'] = this.workItem.labels.filter((l) => l != label.id);
    this.store.dispatch(new WorkItemActions.Update(workItem));
  }

  showPreview(event: any): void {
    const rawText = event.rawText;
    const callBack = event.callBack;
    this.workItemService.renderMarkDown(rawText).subscribe((renderedHtml) => {
      callBack(rawText, this.sanitizer.bypassSecurityTrustHtml(renderedHtml));
    });
  }

  descUpdate(event: any): void {
    const rawText = event.rawText;
    this.descCallback = event.callBack;
    let workItem = {} as WorkItemUI;
    workItem['version'] = this.workItem.version;
    workItem['link'] = this.workItem.link;
    workItem['id'] = this.workItem.id;
    workItem['description'] = {
      content: rawText,
      markup: 'Markdown',
    };
    this.store.dispatch(new WorkItemActions.Update(workItem));
  }

  updateType(e: CommonSelectorUI[]) {
    if (e[0].key !== this.workItem.type) {
      this.loadingTypes = true;
      let workItem = {} as WorkItemUI;
      workItem['version'] = this.workItem.version;
      workItem['link'] = this.workItem.link;
      workItem['id'] = this.workItem.id;
      workItem['type'] = e[0].key;
      this.store.dispatch(new WorkItemActions.Update(workItem));
    }
  }

  dynamicFieldUpdated(event) {
    let workItem = {} as WorkItemUI;
    //let dynamicfield[event]
    workItem['version'] = this.workItem.version;
    workItem['link'] = this.workItem.link;
    workItem['id'] = this.workItem.id;
    workItem['type'] = this.workItem.type;

    workItem['dynamicfields'] = {};
    workItem['dynamicfields'][event.key] = event.newValue;

    this.store.dispatch(new WorkItemActions.Update(workItem));
  }

  @HostListener('window:keydown', ['$event'])
  onKeyEvent(event: any) {
    // for ESC key handling
    if (event.keyCode == 27 && this.listenToEsc) {
      this.closeDetail();
      this.listenToEsc = false;
    }
  }
}
