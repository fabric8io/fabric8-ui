import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription
} from 'rxjs';

import { flatten } from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {
  Space,
  SpaceService
} from 'ngx-fabric8-wit';

export enum ViewState {
  INIT = 'INIT',
  EMPTY = 'EMPTY',
  LOADING = 'LOADING',
  // PRESHOW dummy state is used to allow an empty infinitescroll component
  // to be initialized, compute the pagesize, and report that pagesize
  // back to this component, which can then use it for query requests to
  // populate the true infinitescroll component in "SHOW" state
  PRESHOW = 'PRESHOW',
  SHOW = 'SHOW'
}

@Component({
  selector: 'my-spaces-search-spaces-dialog',
  templateUrl: './my-spaces-search-spaces-dialog.component.html',
  styleUrls: ['./my-spaces-search-spaces-dialog.component.less']
})
export class MySpacesSearchSpacesDialog implements OnDestroy, OnInit {

  @ViewChild('modal') private readonly host: ModalDirective;
  @ViewChild('searchField') private readonly searchField: ElementRef;

  readonly spaces: Subject<Space[]> = new BehaviorSubject<Space[]>([]);
  readonly totalCount: Subject<number> = new BehaviorSubject<number>(0);
  readonly viewState: Subject<ViewState> = new BehaviorSubject<ViewState>(ViewState.INIT);
  searchTerm: string = '';

  private readonly subscriptions: Subscription[] = [];
  private pageSize: number = 20;

  constructor(
    private readonly spaceService: SpaceService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.host.onShown.subscribe((): void => (this.searchField.nativeElement as HTMLElement).focus())
    );
    this.subscriptions.push(
      this.host.onHidden.subscribe((): void => this.clear())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

  show(): void {
    this.host.show();
  }

  hide(): void {
    this.host.hide();
  }

  clear(): void {
    this.searchTerm = '';
    this.viewState.next(ViewState.INIT);
    this.spaces.next([]);
    this.totalCount.next(0);
  }

  initItems(event: { pageSize: number }): void {
    this.pageSize = event.pageSize;
    setTimeout(() => this.viewState.next(ViewState.LOADING));
  }

  search(): void {
    this.totalCount.next(0);
    this.spaces.next([]);
    if (!this.searchTerm.trim()) {
      this.viewState.next(ViewState.INIT);
      return;
    }
    this.viewState.next(ViewState.PRESHOW);
    this.viewState
      .filter((viewState: ViewState): boolean => viewState === ViewState.LOADING)
      .first()
      .flatMap(() => this.spaceService.search(this.searchTerm.trim(), this.pageSize).first())
      .first()
      .do(() => (this.searchField.nativeElement as HTMLElement).blur())
      .do(() => this.spaceService.getTotalCount().first().subscribe((count: number): void => this.totalCount.next(count)))
      .do((spaces: Space[]) => this.viewState.next(spaces.length === 0 ? ViewState.EMPTY : ViewState.SHOW))
      .subscribe(
        (spaces: Space[]): void => this.spaces.next(spaces),
        (err: any): void => console.error(err)
      );
  }

  fetchMoreSpaces(): void {
    Observable.combineLatest(
      this.spaces,
      this.spaceService.getMoreSearchResults()
    )
      .first()
      .map(flatten)
      .subscribe(
        (spaces: Space[]): void => this.spaces.next(spaces),
        (err: any): void => {
          if (err !== 'No more spaces found') {
            console.error(err);
          }
        });
  }
}
