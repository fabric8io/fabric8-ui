import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Spaces } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

import { CustomQueryModel } from '../../models/custom-query.model';
import { FilterService } from '../../services/filter.service';
import { ModalService } from '../../services/modal.service';

// ngrx stuff
import { select, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import * as CustomQueryActions from './../../actions/custom-query.actions';
import { AppState } from './../../states/app.state';

@Component({
  selector: 'custom-query',
  templateUrl: './custom-query-panel.component.html',
  styleUrls: ['./custom-query-panel.component.less'],
})
export class CustomQueryComponent implements OnInit, OnDestroy {
  @Input() sidePanelOpen: boolean = true;
  @Input() context: 'list' | 'board'; // 'list' or 'board'

  authUser: any = null;
  private spaceId;
  private eventListeners: any[] = [];
  private customQueries: CustomQueryModel[] = [];
  private startedCheckingURL: boolean = false;
  private showTree: string = '';
  private showCompleted: string = '';

  constructor(
    private auth: AuthenticationService,
    private filterService: FilterService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private spaces: Spaces,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    const customQueriesData = this.store.pipe(
      select('planner'),
      select('customQueries'),
    );

    this.eventListeners.push(
      customQueriesData.subscribe((customQueries) => {
        this.customQueries = customQueries;
        if (!this.startedCheckingURL && !!this.customQueries.length) {
          this.checkURL();
        }
      }),
    );
  }

  ngOnDestroy() {
    this.eventListeners.forEach((e) => e.unsubscribe());
  }

  constructUrl(attributes) {
    let jsonAttributes = JSON.parse(attributes);
    let jsonQuery = this.filterService.jsonToQuery(jsonAttributes);
    return jsonQuery;
  }

  checkURL() {
    this.startedCheckingURL = true;
    this.eventListeners.push(
      this.route.queryParams.subscribe((val) => {
        if (val.hasOwnProperty('q')) {
          const urlQuery = val['q'];
          let foundMatch = false;
          this.customQueries.forEach((q) => {
            if (this.constructUrl(q.attributes.fields) === urlQuery) {
              foundMatch = true;
              this.store.dispatch(new CustomQueryActions.Select(q));
            }
          });
          if (!foundMatch) {
            this.store.dispatch(new CustomQueryActions.SelectNone());
          }
        }
        if (val.hasOwnProperty('showTree')) {
          this.showTree = val.showTree;
        } else {
          this.showTree = '';
        }
        if (val.hasOwnProperty('showCompleted')) {
          this.showCompleted = val.showCompleted;
        } else {
          this.showCompleted = '';
        }
      }),
    );
  }

  addRemoveQueryParams(queryField) {
    if (this.showCompleted && this.showTree) {
      return {
        q: this.constructUrl(queryField),
        showTree: this.showTree,
        showCompleted: this.showCompleted,
      };
    } else if (this.showTree) {
      return {
        q: this.constructUrl(queryField),
        showTree: this.showTree,
      };
    } else if (this.showCompleted) {
      return {
        q: this.constructUrl(queryField),
        showCompleted: this.showCompleted,
      };
    } else {
      return {
        q: this.constructUrl(queryField),
      };
    }
  }

  getRouterLink() {
    return this.context === 'board' ? ['..'] : [];
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  confirmCustomQueryDelete(event, customQuery) {
    // this.stopPropagation(event);
    this.modalService
      .openModal(
        'Delete Filter',
        'Are you sure you want to delete this filter?',
        'Delete',
        'deleteFilter',
      )
      .pipe(first())
      .subscribe((actionKey) => {
        if (actionKey === 'deleteFilter') {
          this.deleteCustomQuery(customQuery);
        }
      });
  }

  deleteCustomQuery(customQuery) {
    this.store.dispatch(new CustomQueryActions.Delete(customQuery));
  }
}
