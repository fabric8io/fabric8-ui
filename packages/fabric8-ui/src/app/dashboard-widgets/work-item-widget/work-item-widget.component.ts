import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { WorkItem, WorkItemService } from 'fabric8-planner';
import { uniqueId } from 'lodash';
import { Contexts } from 'ngx-fabric8-wit';
import { ConnectableObservable, Observable, Subscription } from 'rxjs';
import { map, publishReplay, switchMap, tap } from 'rxjs/operators';
import { SpacesService } from '../../shared/spaces.service';
import { WorkItemsData } from '../../shared/workitem-utils';
import { WorkItemBarchartConfig } from './work-item-barchart/work-item-barchart-config';
import { WorkItemBarchartData } from './work-item-barchart/work-item-barchart-data';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-work-item-widget',
  templateUrl: './work-item-widget.component.html',
  styleUrls: ['./work-item-widget.component.less'],
})
export class WorkItemWidgetComponent implements OnInit {
  @Input() userOwnsSpace: boolean;

  private _myWorkItems: ConnectableObservable<WorkItem[]>;

  private subscriptions: Subscription[] = [];

  myWorkItemsCount: number;

  myWorkItemsResolved: number = 0;

  myWorkItemsInProgress: number = 0;

  myWorkItemsOpen: number = 0;

  contextPath: string;

  loading: boolean;

  LABEL_RESOLVED: string = 'Resolved';

  LABEL_IN_PROGRESS: string = 'In Progress';

  LABEL_OPEN: string = 'Open';

  STATE_RESOLVED: string = 'resolved';

  STATE_IN_PROGRESS: string = 'in progress';

  STATE_OPEN: string = 'open';

  chartConfig: WorkItemBarchartConfig = {
    chartId: uniqueId('work-item-chart'),
    size: {
      height: 200,
      width: 130,
    },
  };

  chartData: WorkItemBarchartData = {
    colors: {},
    yData: [],
  };

  constructor(
    private contexts: Contexts,
    private spacesService: SpacesService,
    private workItemService: WorkItemService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.contexts.current.subscribe((context) => {
        this.contextPath = context.path;
        this.resetWorkItemCounts();
        this.updateWorkItems();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private resetWorkItemCounts(): void {
    this.myWorkItemsCount = 0;
    this.myWorkItemsOpen = 0;
    this.myWorkItemsInProgress = 0;
    this.myWorkItemsResolved = 0;
  }

  private updateWorkItems(): void {
    this.loading = true;
    this._myWorkItems = this.spacesService.current.pipe(
      switchMap((space) =>
        this.workItemService.getWorkItems(100000, { expression: { space: `${space.id}` } }),
      ),
      tap(
        (val: WorkItemsData): void => {
          if (val.totalCount) {
            this.myWorkItemsCount = val.totalCount;
          } else {
            this.myWorkItemsCount = val.workItems.length;
          }
        },
      ),
      map((val) => val.workItems),
      tap((workItems) => {
        this.loading = false;
        workItems.forEach((workItem) => {
          const state = workItem.attributes['system.state'];
          if (state !== undefined) {
            if (this.isStateEqual(state, this.STATE_OPEN)) {
              this.myWorkItemsOpen++;
            } else if (this.isStateEqual(state, this.STATE_IN_PROGRESS)) {
              this.myWorkItemsInProgress++;
            } else if (this.isStateEqual(state, this.STATE_RESOLVED)) {
              this.myWorkItemsResolved++;
            }
          }
        });
        this.initChartData();
      }),
      publishReplay(1),
    ) as ConnectableObservable<WorkItem[]>;
    this._myWorkItems.connect();
  }

  private isStateEqual(state1: string, state2: string): boolean {
    return state1.localeCompare(state2, 'en', { sensitivity: 'base' }) === 0;
  }

  get myWorkItems(): Observable<WorkItem[]> {
    return this._myWorkItems;
  }

  private initChartData(): void {
    this.chartData.colors[this.LABEL_RESOLVED] = '#3f9c35'; // color-pf-green-400
    this.chartData.colors[this.LABEL_IN_PROGRESS] = '#ec7a08'; // @color-pf-orange-400
    this.chartData.colors[this.LABEL_OPEN] = '#cc0000'; // @color-pf-red-100
    this.chartData.yData[0] = [this.LABEL_RESOLVED, this.myWorkItemsResolved];
    this.chartData.yData[1] = [this.LABEL_IN_PROGRESS, this.myWorkItemsInProgress];
    this.chartData.yData[2] = [this.LABEL_OPEN, this.myWorkItemsOpen];
    this.chartData.yGroups = [this.LABEL_RESOLVED, this.LABEL_IN_PROGRESS, this.LABEL_OPEN];
  }
}
