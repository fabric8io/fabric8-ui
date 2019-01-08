import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Broadcaster } from 'ngx-base';
import { FilterConfig, FilterEvent } from 'patternfly-ng/filter';
import { ToolbarConfig } from 'patternfly-ng/toolbar';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';

import { Space } from 'ngx-fabric8-wit';
import { AuthenticationService, User } from 'ngx-login-client';

import { AreaQuery, AreaUI } from '../../models/area.model';
import { FilterModel } from '../../models/filter.model';
import { WorkItem, WorkItemQuery } from '../../models/work-item';
import { WorkItemTypeQuery, WorkItemTypeUI } from '../../models/work-item-type';
import { FilterService } from '../../services/filter.service';
import { AND, EQUAL } from '../../services/query-keys';
import { GroupTypeQuery, GroupTypeUI } from './../../models/group-types.model';
import { IterationQuery, IterationUI } from './../../models/iteration.model';
import { LabelQuery, LabelUI } from './../../models/label.model';
import { UserQuery, UserUI } from './../../models/user';

// ngrx stuff
import { select, Store } from '@ngrx/store';
import * as CustomQueryActions from './../../actions/custom-query.actions';
import { SpaceQuery } from './../../models/space';
import { AppState, PlannerState } from './../../states/app.state';
import * as states from './../../states/index.state';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'toolbar-panel',
  templateUrl: './toolbar-panel.component.html',
  styleUrls: ['./toolbar-panel.component.less'],
})
export class ToolbarPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() context: string;
  @Input() loggedInUser: User | Object = {};
  @Input() dropdownPlacement: any = 'right'; // value is right or left
  @Output() readonly onCreateNewWorkItemSelected: EventEmitter<any | null> = new EventEmitter();

  loggedIn: boolean = false;
  showTypesOptions: boolean = false;

  filters: any[] = [];
  workItemDetail: WorkItem;
  spaceSubscription: Subscription = null;
  eventListeners: any[] = [];
  existingAllowedQueryParams: Object = {};
  filterConfig: FilterConfig = {
    fields: [
      {
        id: 'type',
        title: 'Select',
        placeholder: 'Select a filter type',
        type: 'select',
      },
    ],
    appliedFilters: [],
    resultsCount: -1, // Hide
    selectedCount: 0,
    totalCount: 0,
    tooltipPlacement: 'right',
  } as FilterConfig;
  toolbarConfig: ToolbarConfig = {
    actionConfig: {},
    filterConfig: this.filterConfig,
  } as ToolbarConfig;
  allowedFilterKeys: string[] = [];
  allowedMultipleFilterKeys: string[] = ['label'];
  textFilterKeys: string[] = ['title'];

  showSaveFilterButton: boolean = true;
  isFilterSaveOpen: boolean = false;
  totalCount: Observable<number>;

  // the type of the list is changed (Hierarchy/Flat).
  currentListType: string = 'Hierarchy';

  private queryParamSubscriber = null;
  private savedFIlterFieldQueries = {};

  private separator = {
    id: 'separator',
    value: null,
    separator: true,
  };
  private loader = {
    id: 'loader',
    value: 'Loading...',
    iconStyleClass: 'fa fa-spinner',
  };
  private workItemTypeData: Observable<WorkItemTypeUI[]>;
  private stateData: Observable<string[]>;
  private labelData: Observable<LabelUI[]>;
  private spaceData: Observable<Space>;
  private filterData: Observable<FilterModel[]>;
  private groupTypeData: Observable<GroupTypeUI[]>;
  private iterationData: Observable<IterationUI[]>;

  private activeFilters = [];
  private activeFilterFromSidePanel: string = '';
  private currentQuery: string = '';

  private isShowTreeOn: boolean = false;
  private isShowCompletedOn: boolean = false;
  private isStateFilterSelected: boolean = false;

  private routeSource = this.route.queryParams.pipe(filter((p) => p.hasOwnProperty('q')));
  private queryExp;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private broadcaster: Broadcaster,
    private filterService: FilterService,
    private auth: AuthenticationService,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private userQuery: UserQuery,
    private labelQuery: LabelQuery,
    private groupTypeQuery: GroupTypeQuery,
    private iterationQuery: IterationQuery,
    private areaQuery: AreaQuery,
    private workItemQuery: WorkItemQuery,
    private workItemTypeQuery: WorkItemTypeQuery,
    private spaceQuery: SpaceQuery,
  ) {}

  ngOnInit() {
    console.log('[ToolbarPanelComponent] Running in context: ' + this.context);
    this.loggedIn = this.auth.isLoggedIn();
    this.initiateDataSources();
    //on the board view - do not show state filter as the lanes are based on state
    this.allowedFilterKeys = ['assignee', 'creator', 'area', 'label', 'workitemtype', 'title'];
    if (this.context !== 'boardview') {
      this.allowedFilterKeys.push('state');
    }
    this.routeSource.subscribe((queryParam) => (this.queryExp = queryParam.q));

    const customQueriesData = this.store.pipe(
      select('planner'),
      select('customQueries'),
      filter((customQueries) => !!customQueries.length),
    );
    this.totalCount = this.workItemQuery.getWorkItems().pipe(
      map((items) => {
        if (this.isShowTreeOn) {
          return items.filter((item) => item.bold === true).length;
        } else {
          return items.length;
        }
      }),
    );

    this.eventListeners.push(
      customQueriesData.subscribe((queries) => {
        const selected = queries.find((q) => q.selected);
        if (selected) {
          // if any selected saved filter found
          // then save filter button will not be shown
          // to avoid duplication
          this.showSaveFilterButton = false;
        } else {
          this.showSaveFilterButton = true;
        }
      }),
    );
  }

  ngAfterViewInit(): void {
    // listen for logout events.
    this.eventListeners.push(
      this.broadcaster.on<string>('logout').subscribe((message) => {
        this.loggedIn = false;
      }),
    );

    this.eventListeners.push(
      this.filterData.pipe(delay(1000)).subscribe((filters) => this.setFilterTypes(filters)),
    );

    this.eventListeners.push(
      combineLatest(
        this.areaQuery.getAreas(),
        this.userQuery.getCollaborators(),
        this.workItemTypeData,
        this.stateData,
        this.labelData,
      ).subscribe(() => {
        // Once all the attributes are resolved
        // Listen for the URLs to set applied filters
        this.checkURL();
        this.checkFilterFromSidePanle();
      }),
    );
  }

  ngOnDestroy() {
    // make sure we unsubscribe from all events.
    if (this.queryParamSubscriber) {
      this.queryParamSubscriber.unsubscribe();
    }
    this.eventListeners.map((e) => e.unsubscribe());
    // clean up.
    this.filterConfig.appliedFilters = [];
    this.filterService.clearFilters(this.allowedFilterKeys);
  }

  setFilterTypes(filters: FilterModel[]) {
    filters = filters.filter((f) => this.allowedFilterKeys.indexOf(f.attributes.key) > -1);

    /*
     * The current version of the patternfly filter dropdown does not fully support the async
     * update of the filterConfig.fields fields set. It does not refresh the widget on field
     * array change. The current workaround is to add a 'dummy' entry 'Select Filter..' as
     * the first entry in the fields array. When the user selects a new value from the
     * filter list, the implementation works subsequently.
     */
    const filterMap = this.getFilterMap();
    this.toolbarConfig.filterConfig.fields = [
      this.toolbarConfig.filterConfig.fields[0],
      ...filters.map((filter) => {
        const type = filter.attributes.key;
        return {
          id: type,
          title: filter.attributes.title,
          placeholder: filter.attributes.description,
          type: filterMap[type].type,
          queries: [this.loader],
        };
      }),
    ];
  }

  filterChange($event: FilterEvent): void {
    this.toolbarConfig.filterConfig.appliedFilters = [];
    const oldQueryJson = this.filterService.queryToJson(this.currentQuery);
    const field = $event.field.id;
    const value = $event.hasOwnProperty('query') ? $event.query.id : $event.value;
    const newQuery = this.filterService.queryBuilder(field, EQUAL, value);
    const finalQuery = this.filterService.queryJoiner(oldQueryJson, AND, newQuery);
    const queryString = this.filterService.jsonToQuery(finalQuery);
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    queryParams['q'] = queryString;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });
  }

  selectFilterType(event: FilterEvent) {
    const filterMap = this.getFilterMap();
    if (Object.keys(filterMap).indexOf(event.field.id) > -1) {
      const index = this.filterConfig.fields.findIndex((i) => i.id === event.field.id);
      if (filterMap[event.field.id].type !== 'text') {
        this.eventListeners.push(
          filterMap[event.field.id].datasource.subscribe((resp) => {
            if (filterMap[event.field.id].datamap(resp).primaryQueries.length) {
              this.toolbarConfig.filterConfig.fields[index].queries = [
                ...filterMap[event.field.id].datamap(resp).primaryQueries,
                this.separator,
                ...filterMap[event.field.id].datamap(resp).queries,
              ];
            } else {
              this.toolbarConfig.filterConfig.fields[index].queries = filterMap[
                event.field.id
              ].datamap(resp).queries;
            }
            this.savedFIlterFieldQueries[this.filterConfig.fields[index].id] = {};
            this.savedFIlterFieldQueries[this.filterConfig.fields[index].id]['fixed'] = filterMap[
              event.field.id
            ].datamap(resp).primaryQueries;
            this.savedFIlterFieldQueries[this.filterConfig.fields[index].id][
              'filterable'
            ] = filterMap[event.field.id].datamap(resp).queries;
          }),
        );
      } else if (this.filterConfig.fields[index].type === 'typeahead') {
        this.filterQueries({
          value: '',
          field: event.field,
        });
      }
    }
  }

  /**
   * For type ahead event handle
   * from tool bar component
   * @param event
   */
  filterQueries(event: FilterEvent) {
    const index = this.filterConfig.fields.findIndex((i) => i.id === event.field.id);
    let inp = event.value.trim();

    if (inp) {
      this.filterConfig.fields[index].queries = [
        ...this.savedFIlterFieldQueries[event.field.id]['fixed'],
        this.separator,
        ...this.savedFIlterFieldQueries[event.field.id]['filterable'].filter((item) => {
          return item.value.toLowerCase().indexOf(inp.toLowerCase()) > -1;
        }),
      ];
    }
    if (inp === '' && typeof this.savedFIlterFieldQueries[event.field.id] !== 'undefined') {
      this.filterConfig.fields[index].queries = [
        ...this.savedFIlterFieldQueries[event.field.id]['fixed'],
        this.separator,
        ...this.savedFIlterFieldQueries[event.field.id]['filterable'],
      ];
    }
  }

  initiateDataSources() {
    this.workItemTypeData = this.workItemTypeQuery
      .getWorkItemTypes()
      .pipe(filter((a) => !!a.length));
    this.stateData = this.store.pipe(
      select('planner'),
      select('workItemStates'),
      filter((a) => !!a.length),
    );
    this.labelData = this.labelQuery.getLables().pipe(filter((l) => l !== null));
    this.spaceData = this.spaceQuery.getCurrentSpace.pipe(filter((space) => space !== null));
    this.filterData = this.store.pipe(
      select('toolbar'),
      select('filters'),
      filter((filters) => !!filters.length),
    );
    this.iterationData = this.iterationQuery.getIterations().pipe(filter((i) => !!i.length));
    this.groupTypeData = this.groupTypeQuery.getGroupTypes.pipe(filter((i) => !!i.length));
  }

  getFilterMap() {
    return {
      area: {
        datasource: this.areaQuery.getAreas(),
        datamap: (areas: AreaUI[]) => {
          return {
            queries: areas.map((area) => {
              return { id: area.id, value: area.name };
            }),
            primaryQueries: [],
          };
        },
        getvalue: (area: AreaUI) => area.name,
        type: 'select',
      },
      assignee: {
        datasource: this.userQuery.getCollaborators(),
        datamap: (users) => {
          const currentUsers = users.filter((u) => u.currentUser);
          const authUser = currentUsers.length ? currentUsers[0] : null;
          return {
            queries: users
              .filter((u) => !u.currentUser)
              .map((user: UserUI) => {
                return { id: user.id, value: user.username, imageUrl: user.avatar };
              }),
            primaryQueries: authUser
              ? [
                  {
                    id: authUser.id,
                    value: authUser.username + ' (me)',
                    imageUrl: authUser.avatar,
                  },
                  { id: null, value: 'Unassigned' },
                ]
              : [{ id: null, value: 'Unassigned' }],
          };
        },
        type: 'typeahead',
      },
      creator: {
        datasource: this.userQuery.getCollaborators(),
        datamap: (users) => {
          const currentUsers = users.filter((u) => u.currentUser);
          const authUser = currentUsers.length ? currentUsers[0] : null;
          return {
            queries: users
              .filter((u) => !u.currentUser)
              .map((user: UserUI) => {
                return { id: user.id, value: user.username, imageUrl: user.avatar };
              }),
            primaryQueries: authUser
              ? [{ id: authUser.id, value: authUser.username + ' (me)', imageUrl: authUser.avatar }]
              : [],
          };
        },
        getvalue: (user) => user.attributes.username,
        type: 'typeahead',
      },
      workitemtype: {
        datasource: this.workItemTypeData,
        datamap: (witypes: WorkItemTypeUI[]) => {
          return {
            queries: witypes
              .sort((a, b) => (a.name > b.name ? 1 : 0))
              .map((witype) => ({
                id: witype.id,
                value: witype.name,
                iconStyleClass: witype.icon,
              })),
            primaryQueries: [],
          };
        },
        getvalue: (type: WorkItemTypeUI) => type.name,
        type: 'select',
      },
      state: {
        datasource: this.stateData,
        datamap: (wistates: string[]) => {
          return {
            queries: wistates.map((wistate) => {
              return { id: wistate, value: wistate };
            }),
            primaryQueries: [],
          };
        },
        getvalue: (type) => type,
        type: 'select',
      },
      label: {
        datasource: this.labelData,
        datamap: (labels: LabelUI[]) => {
          return {
            queries: labels
              .sort((l1, l2) => (l1.name.toLowerCase() > l2.name.toLowerCase() ? 1 : 0))
              .map((label) => {
                return {
                  id: label.id,
                  value: label.name,
                };
              }),
            primaryQueries: [],
          };
        },
        getvalue: (label: LabelUI) => label.name,
        type: 'typeahead',
      },
      title: {
        type: 'text',
      },
    };
  }

  checkURL() {
    this.eventListeners.push(
      this.route.queryParams.subscribe((query) => {
        if (query.hasOwnProperty('q')) {
          this.currentQuery = query.q;
          const fields = this.filterService.queryToFlat(this.currentQuery);
          let stateFilter = fields.findIndex((f) => f.field === 'state');
          this.isStateFilterSelected = false;
          if (stateFilter > -1) {
            this.isStateFilterSelected = true;
          }
          this.handleShowTreeCheckBox();
          this.formatFilterFIelds(fields);
        } else {
          this.activeFilters = [];
          this.currentQuery = '';
        }
      }),
    );
  }

  checkFilterFromSidePanle() {
    this.eventListeners.push(
      combineLatest(this.groupTypeData, this.iterationData)
        .pipe(
          map(([gt, it]) => {
            const selectedIt: IterationUI = it.find((i) => i.selected);
            const selectedGt: GroupTypeUI = gt.find((i) => i.selected);
            return [selectedIt, selectedGt];
          }),
          filter(([gt, it]) => {
            return !!gt || !!it;
          }),
          map(([gt, it]) => {
            if (!!gt) {
              return gt.name;
            }
            if (!!it) {
              return it.name;
            }
          }),
        )
        .subscribe((selected) => {
          this.activeFilterFromSidePanel = selected;
          this.cdr.markForCheck();
        }),
    );
  }

  formatFilterFIelds(fields) {
    combineLatest(
      this.areaQuery.getAreas(),
      this.userQuery.getCollaborators(),
      this.workItemTypeData,
      this.stateData,
      this.labelData,
    ).subscribe(([areas, users, wiTypes, states, labels]) => {
      const filterMap = this.getFilterMap();
      fields = fields.filter((f) => {
        return this.allowedFilterKeys.indexOf(f.field) > -1;
      });
      this.activeFilters = [
        ...fields.map((f) => {
          switch (f.field) {
            case 'creator':
            case 'assignee':
              const user = users.find((u) => u.id === f.value);
              f['displayValue'] = f.value == 'null' ? 'Unassigned' : user ? user.username : f.value;
              break;
            case 'area':
              const area = areas.find((a) => a.id === f.value);
              f['displayValue'] = area ? area.name : f.value;
              break;
            case 'workitemtype':
              const witype = wiTypes.find((w) => w.id === f.value);
              f['displayValue'] = witype ? witype.name : f.value;
              break;
            case 'state':
              const state = states.find((s) => s === f.value);
              f['displayValue'] = state ? state : f.value;
              break;
            case 'label':
              const label = labels.find((l) => l.id === f.value);
              f['displayValue'] = label ? label.name : f.value;
              break;
            case 'title':
              f['displayValue'] = f.value;
              break;
            default:
              f['displayValue'] = '';
              break;
          }
          return f;
        }),
      ];
    });
  }

  removeFilter(field = null) {
    const fields = this.filterService.queryToFlat(this.currentQuery);
    fields.splice(field.index, 1);
    const queryString = this.filterService.jsonToQuery(this.filterService.flatToQuery(fields));
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    queryParams['q'] = queryString;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });
  }

  removeAllFilters() {
    const fields = this.filterService.queryToFlat(this.currentQuery).filter((f) => {
      return (
        this.activeFilters.findIndex((af) => af.field === f.field && af.value === f.value) === -1
      );
    });
    const queryString = this.filterService.jsonToQuery(this.filterService.flatToQuery(fields));
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    queryParams['q'] = queryString;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });
  }

  saveFilters(filterSaveInp: HTMLInputElement) {
    if (filterSaveInp.value !== '') {
      //let exp = JSON.stringify(this.filterService.queryToJson(this.queryExp));
      let exp = this.queryExp;
      let e1 = this.filterService.queryToJson(exp);
      let str = '' + JSON.stringify(e1);
      let customQuery = {
        attributes: {
          fields: str,
          title: filterSaveInp.value,
        },
        type: 'queries',
      };
      this.store.dispatch(new CustomQueryActions.Add(customQuery));
      this.closeFilterSave(filterSaveInp);
    }
  }

  showTreeToggle(e) {
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    if (e.target.checked) {
      queryParams['showTree'] = true;
    } else {
      if (queryParams.hasOwnProperty('showTree')) {
        delete queryParams['showTree'];
      }
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });
  }

  showCompletedToggle(e) {
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    if (e.target.checked) {
      queryParams['showCompleted'] = true;
    } else {
      if (queryParams.hasOwnProperty('showCompleted')) {
        delete queryParams['showCompleted'];
      }
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });
  }

  handleShowTreeCheckBox() {
    let currentParams = cloneDeep(this.route.snapshot.queryParams);
    if (currentParams.hasOwnProperty('showTree')) {
      if (currentParams['showTree'] === 'true') {
        this.isShowTreeOn = true;
      } else if (currentParams['showTree'] === 'false') {
        this.isShowTreeOn = false;
      }
    } else {
      this.isShowTreeOn = false;
    }
    if (currentParams.hasOwnProperty('showCompleted')) {
      if (currentParams['showCompleted'] === 'true') {
        this.isShowCompletedOn = true;
      } else if (currentParams['showCompleted'] === 'false') {
        this.isShowCompletedOn = false;
      }
    } else {
      this.isShowCompletedOn = false;
    }
  }

  closeFilterSave(filterSaveInp: HTMLInputElement) {
    this.isFilterSaveOpen = false;
    filterSaveInp.value = '';
  }

  saveFilterDropdownChange(value: boolean) {
    this.isFilterSaveOpen = value;
  }
}
