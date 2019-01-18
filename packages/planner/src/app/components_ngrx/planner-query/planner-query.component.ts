import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { sortBy } from 'lodash';
import { cloneDeep, isEqual } from 'lodash';
import { EmptyStateConfig } from 'patternfly-ng';
import { combineLatest, empty, Observable, of } from 'rxjs';
import { delay, filter, startWith, switchMap, tap } from 'rxjs/operators';
import { PermissionQuery } from '../../models/permission.model';
import { SpaceQuery } from '../../models/space';
import { WorkItemQuery, WorkItemUI } from '../../models/work-item';
import { WorkItemTypeQuery, WorkItemTypeUI } from '../../models/work-item-type';
import { CookieService } from '../../services/cookie.service';
import { FilterService } from '../../services/filter.service';
import { QuerySuggestionService } from '../../services/query-suggestion.service';
import { UrlService } from '../../services/url.service';
import { AppState } from '../../states/app.state';
import { ListItemComponent } from '../../widgets/list-item/list-item.component';
import { datatableColumn } from '../planner-list/datatable-config';
import * as WorkItemActions from './../../actions/work-item.actions';
import { WorkItemPreviewPanelComponent } from './../work-item-preview-panel/work-item-preview-panel.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'planner-query',
  templateUrl: './planner-query.component.html',
  styleUrls: ['./planner-query.component.less'],
})
export class PlannerQueryComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  @ViewChild('quickPreview') quickPreview: WorkItemPreviewPanelComponent;
  @ViewChild('listContainer') listContainer: ElementRef;
  @ViewChild('querySearch') querySearchRef: ElementRef;
  @ViewChild('queryInput') searchField: ElementRef;
  @ViewChildren(ListItemComponent) dropdownOptions: QueryList<ListItemComponent>;

  public valueLoading: boolean = false;

  workItemsSource: Observable<WorkItemUI[]> = combineLatest(
    this.spaceQuery.getCurrentSpace.pipe(filter((s) => !!s)),
    this.route.queryParams.pipe(filter((q) => !!q)),
    // Wait untill workItemTypes are loaded
    this.workItemTypeQuery.getWorkItemTypes().pipe(filter((wt) => !!wt.length)),
  ).pipe(
    delay(500),
    switchMap(([space, query]) => {
      if (query.hasOwnProperty('q') && query.q !== '') {
        this.searchQuery = query.q;
        this.disableInput = false;
        this.currentQuery = this.breadcrumbsText('', query);
        this.filters = this.filterService.queryToJson(query.q);
        this.store.dispatch(
          new WorkItemActions.Get({
            pageSize: this.initialPageSize,
            filters: this.filters,
            isShowTree: false,
          }),
        );
        this.scrollCheckedFor = 0;
      }
      if (query.hasOwnProperty('prevq')) {
        this.breadcrumbs = JSON.parse(query.prevq);
      }
      return this.workItemQuery.getWorkItems();
    }),
    startWith([]),
  );
  public quickAddWorkItemTypes: Observable<
    WorkItemTypeUI[]
  > = this.workItemTypeQuery.getWorkItemTypes();
  public currentQuery: string;
  public breadcrumbs: any[] = [];
  public disableInput: boolean;
  public uiLockedList: boolean = false;
  public emptyStateConfig: EmptyStateConfig;
  public contentItemHeight: number = 50;
  public columns: any[] = [];
  public selectedRows: any = [];
  public searchQuery: string = '';
  public isCreateWorkitemDropdownOpen: boolean;
  public _lastCheckedScrollHeight: any;
  public _scrollTrigger: number;
  public headerHeight: number = 30;
  public targetHeight: number;
  public addDisabled: Observable<boolean> = this.permissionQuery.isAllowedToAdd();
  public isSuggestionDropdownOpen: boolean;
  public keyManager: ActiveDescendantKeyManager<ListItemComponent>;

  private eventListeners: any[] = [];
  private hdrHeight: number = 0;
  private querySearchRefHt: number = 0;
  private initialPageSize: number = 25;
  private filters = null;
  // This variable stores the number of items
  // Scroll is already checked for
  private scrollCheckedFor: number = 0;
  private isQuickPreviewOpen: boolean;

  private querySuggestion: Observable<string[]> = this.querySuggestionService.getSuggestions().pipe(
    filter((s) => !!s),
    delay(500),
    tap(() => (this.valueLoading = false)),
    tap((s) => {
      if (s.length > 0) {
        this.isSuggestionDropdownOpen = true;
      } else {
        this.isSuggestionDropdownOpen = false;
      }
    }),
  );

  constructor(
    private cookieService: CookieService,
    private spaceQuery: SpaceQuery,
    private router: Router,
    private route: ActivatedRoute,
    private workItemQuery: WorkItemQuery,
    private store: Store<AppState>,
    private filterService: FilterService,
    private renderer: Renderer2,
    private workItemTypeQuery: WorkItemTypeQuery,
    private urlService: UrlService,
    private el: ElementRef,
    private permissionQuery: PermissionQuery,
    private querySuggestionService: QuerySuggestionService,
  ) {}

  ngOnInit() {
    this.emptyStateConfig = {
      info: 'There are no Work Items for your selected criteria',
      title: 'No Work Items Available',
    } as EmptyStateConfig;
    this.store.dispatch(new WorkItemActions.ResetWorkItems());
    this.eventListeners.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationStart))
        .subscribe((event: any) => {
          if (event.url.indexOf('/plan/detail/') > -1) {
            // It's going to the detail page
            let url = location.pathname;
            let query = location.href.split('?');
            if (query.length == 2) {
              url = url + '?' + query[1];
            }
            this.urlService.recordLastListOrBoard(url);
          }
        }),
    );
  }

  ngOnDestroy() {
    this.store.dispatch(new WorkItemActions.ResetWorkItems());
    this.eventListeners.forEach((e) => e.unsubscribe());
  }

  onPreview(workItem: WorkItemUI): void {
    this.quickPreview.open(workItem);
  }

  closePreview(): void {
    this.quickPreview.close();
  }

  setDataTableColumns() {
    // Cookie for datatableColumn config
    if (!this.cookieService.getCookie(datatableColumn.length).status) {
      this.cookieService.setCookie('datatableColumn', datatableColumn);
      this.columns = datatableColumn;
    } else {
      let temp = this.cookieService.getCookie(datatableColumn.length);
      this.columns = temp.array;
    }
  }

  //ngx-datatable methods
  handleReorder(event) {
    if (event.newValue !== 0) {
      this.columns[event.prevValue - 1].index = event.newValue;
      this.columns[event.newValue - 1].index = event.prevValue;
      this.columns = sortBy(this.columns, 'index');
      this.cookieService.setCookie('datatableColumn', this.columns);
    }
  }

  onInputKeyPress(event: KeyboardEvent) {
    let keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode === UP_ARROW || keycode === DOWN_ARROW) {
      event.preventDefault();
    }
  }

  fetchWorkItemForQuery(event: KeyboardEvent, query: string, cursorPosition: number) {
    let keycode = event.keyCode ? event.keyCode : event.which;
    // If Enter pressed
    if (this.isSuggestionDropdownOpen) {
      if (keycode === 13 && this.keyManager.activeItem) {
        this.onSelectSuggestion(this.keyManager.activeItem.item, query, cursorPosition);
        this.keyManager.setActiveItem(null);
      } else if (keycode === 13 && !this.keyManager.activeItem) {
        this.executeQuery(query);
      } else if (keycode === UP_ARROW || keycode === DOWN_ARROW) {
        event.preventDefault();
        this.keyManager.onKeydown(event);
      } else {
        this.valueLoading = true;
        this.querySuggestionService.queryObservable.next(query);
      }
    } else if (!this.isSuggestionDropdownOpen) {
      if (keycode === 13 && query !== '') {
        this.executeQuery(query);
      } else {
        this.valueLoading = true;
        this.querySuggestionService.queryObservable.next(query);
      }
    } else if (keycode === 8 && (event.ctrlKey || event.metaKey)) {
      this.searchQuery = '';
    }

    if (keycode === LEFT_ARROW || keycode === RIGHT_ARROW) {
      this.querySuggestionService.queryObservable.next(this.getTextTillCurrentCursor());
    }
  }

  executeQuery(query) {
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    if (queryParams.hasOwnProperty('prevq')) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          q: query,
          prevq: queryParams.prevq,
        },
      });
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: query },
      });
    }
  }

  private getTextTillCurrentCursor() {
    return this.searchField.nativeElement.value.slice(
      0,
      this.searchField.nativeElement.selectionStart,
    );
  }

  onSelectSuggestion(suggestion: string, input: string, cursorPosition: number): void {
    this.searchField.nativeElement.value = this.querySuggestionService.replaceSuggestion(
      input.slice(0, cursorPosition),
      input.slice(cursorPosition),
      suggestion,
    );
    this.querySuggestionService.queryObservable.next('-');
    this.searchField.nativeElement.focus();
  }

  onClickSearchField(event) {
    this.valueLoading = true;
    this.querySuggestionService.queryObservable.next(this.getTextTillCurrentCursor());
  }

  clearInputField() {
    this.searchQuery = '';
    this.searchField.nativeElement.focus();
  }

  onBlurSearchField(event) {
    this.querySuggestionService.queryObservable.next('-');
  }

  onChildExploration(workItem: WorkItemUI) {
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    let previousQuery;
    if (queryParams.hasOwnProperty('prevq')) {
      if (queryParams.hasOwnProperty('q')) {
        previousQuery = {
          prevq: [...JSON.parse(queryParams.prevq), { q: queryParams.q }],
        };
      }
    } else {
      previousQuery = { prevq: [queryParams] };
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: 'parent.number : ' + workItem.number,
        prevq: JSON.stringify(previousQuery.prevq),
      },
    });
  }

  navigateToQuery(query) {
    const index = this.breadcrumbs.findIndex((c) => isEqual(c, query));
    const prevq = [...this.breadcrumbs.slice(0, index)];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...query,
        prevq: JSON.stringify(prevq),
      },
    });
  }

  closeCreateWorkItemDialog(event: MouseEvent) {
    if (this.isCreateWorkitemDropdownOpen) {
      this.isCreateWorkitemDropdownOpen = false;
    }
  }

  createWorkItemDialogChange(value: boolean) {
    this.isCreateWorkitemDropdownOpen = value;
  }

  breadcrumbsText(index, query) {
    const parentNumber = this.filterService.isOnlyChildQuery(query.q);
    if (parentNumber !== null) {
      return `Query ${index === '' ? '' : '-'} ${index} (Child of #${parentNumber})`;
    } else {
      return `Query ${index === '' ? '' : '-'} ${index}`;
    }
  }

  checkPageSize(event) {
    // This is a Hack, need to find a better way
    // if number of intially fetched item is lesser than
    // the capable page size then we trigger another request
    if (event.pageSize > this.initialPageSize) {
      this.store.dispatch(
        new WorkItemActions.Get({
          pageSize: event.pageSize,
          filters: this.filters,
          isShowTree: false,
        }),
      );
    }
  }

  onScroll(offsetY: number, numberOfItems: number) {
    const viewHeight = this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;
    if (
      offsetY + viewHeight >= numberOfItems * this.contentItemHeight &&
      this.scrollCheckedFor < numberOfItems
    ) {
      this.scrollCheckedFor = numberOfItems;
      this.fetchMoreItems();
    }
  }

  fetchMoreItems() {
    this.store.dispatch(
      new WorkItemActions.GetMoreWorkItems({
        isShowTree: false,
      }),
    );
  }

  ngAfterViewChecked() {
    if (document.getElementsByClassName('navbar-pf').length > 0) {
      this.hdrHeight = (document.getElementsByClassName(
        'navbar-pf',
      )[0] as HTMLElement).offsetHeight;
    }
    if (this.querySearchRef) {
      this.querySearchRefHt = this.querySearchRef.nativeElement.offsetHeight;
    }
    this.targetHeight = window.innerHeight - (this.hdrHeight + this.querySearchRefHt);
    if (this.listContainer) {
      this.renderer.setStyle(this.listContainer.nativeElement, 'height', this.targetHeight + 'px');
    }
  }

  ngAfterViewInit() {
    this.setDataTableColumns();
    this.keyManager = new ActiveDescendantKeyManager(this.dropdownOptions)
      .withWrap()
      .withTypeAhead();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {}
}
