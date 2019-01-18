import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { WorkItemLinkQuery } from '../../models/link';
import { WorkItemLinkUI } from './../../models/link';
import { WorkItemLinkTypeQuery } from './../../models/link-type';
import { LinkTypeUI } from './../../models/link-type';
import { WorkItemUI } from './../../models/work-item';

import { WorkItemService } from '../../services/work-item.service';

//ngrx stuff
import { Store } from '@ngrx/store';
import * as WorkItemLinkActions from './../../actions/work-item-link.actions';
import { SpaceQuery } from './../../models/space';
import { AppState } from './../../states/app.state';
import { TypeaheadDropdownItem } from './../typeahead-selector/typeahead-selector.component';

@Component({
  selector: 'work-item-link',
  templateUrl: './work-item-link.component.html',
  styleUrls: ['./work-item-link.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('linkState', [
      state(
        'inactive',
        style({
          backgroundColor: '#fff',
        }),
      ),
      state(
        'active',
        style({
          backgroundColor: '#39a5dc',
        }),
      ),
      transition('inactive => active', animate('0.2s 100ms')),
      transition('active => inactive', animate('0.2s 100ms')),
    ]),
  ],
})
export class WorkItemLinkComponent implements OnInit, OnDestroy {
  @Input() context: string = 'list';
  @Input() loggedIn: Boolean;
  @Input() detailContext: string; // It should be detail or preview
  @Output() readonly onLinkClick = new EventEmitter();
  @ViewChild('searchResultList') searchResultList: any;
  @ViewChild('linkTypeSelector') linkTypeSelector: ElementRef;
  @ViewChild('wiSearchBox') wiSearchBox: ElementRef;

  @Input('workItem') set workItemSetter(workItem: WorkItemUI) {
    if (this.workItem === null || this.workItem.id !== workItem.id) {
      this.workItem = workItem;
      this.store.dispatch(new WorkItemLinkActions.Get(this.workItem.link + '/relationships/links'));
      // Reset links value for the new work item first
      this.store.dispatch(new WorkItemLinkActions.ResetLinks());
      this.searchNotAllowedIds = [];
      this.setSearchNotAllowedIds();
    }
  }

  // This is needed to check if workItem was changed
  // Because even during the update input comes through
  private workItem: WorkItemUI = null;

  selectedWorkItem: TypeaheadDropdownItem = null;
  selectedLinkType: LinkTypeUI = null;

  // These are being used in the template
  linkTypesSource: Observable<LinkTypeUI[]> = this.linkTypeQuery.getLinkTypesForDropdown.pipe(
    tap((types) => (this.selectedLinkType = types[0])),
  ); // Setting up the default link type
  workItemLinksSource: Observable<WorkItemLinkUI[]> = this.workItemLinkQuery.getWorkItemLinks.pipe(
    tap((links) => {
      // Reset the create environment
      this.selectedWorkItem = null;
      this.lockCreation = false;

      // to remove the highlight from newly added item
      if (links && links.findIndex((l) => l.newlyAdded) > -1) {
        setTimeout(() => {
          this.store.dispatch(new WorkItemLinkActions.TrivializeAll());
        }, 3000);
      }
    }),
  );
  workItemLinksCountSource: Observable<number> = this.workItemLinkQuery.getWorkItemLinksCount;
  showLinkComponent: Boolean = false;
  lockCreation: boolean = false;

  // This holds the work item ids not allowed to be in search result
  searchNotAllowedIds: string[] = [];

  constructor(
    private store: Store<AppState>,
    private workItemService: WorkItemService,
    private linkTypeQuery: WorkItemLinkTypeQuery,
    private workItemLinkQuery: WorkItemLinkQuery,
    private spaceQuery: SpaceQuery,
  ) {}

  ngOnDestroy() {
    this.store.dispatch(new WorkItemLinkActions.ResetLinks());
  }

  ngOnInit() {}

  setSearchNotAllowedIds() {
    this.searchNotAllowedIds.push(this.workItem.id);
  }

  onSelectRelation(selectedLinkTypes: LinkTypeUI[]): void {
    this.selectedLinkType = selectedLinkTypes[0];
  }

  onSelectWorkItem(event) {
    if (Array.isArray(event) && event.length > 0) {
      this.selectedWorkItem = event[0];
    } else {
      this.selectedWorkItem = null;
    }
  }

  createLink(event: Event) {
    if (this.selectedLinkType && this.selectedWorkItem && !this.lockCreation) {
      this.lockCreation = true;
      let linkPayload = this.createLinkObject(
        this.workItem.id,
        this.selectedWorkItem.key,
        this.selectedLinkType.id,
        this.selectedLinkType.linkType,
      );
      this.store.dispatch(new WorkItemLinkActions.Add(linkPayload));
    }
  }

  deleteLink(event, wiLink, workItem) {
    this.store.dispatch(
      new WorkItemLinkActions.Delete({
        wiLink: wiLink,
        workItemId: workItem.id,
      }),
    );
  }

  onLinkClicked(wiNumber) {
    this.onLinkClick.emit({
      number: wiNumber,
    });
  }

  searchWorkItem(term: string): Observable<TypeaheadDropdownItem[]> {
    return this.spaceQuery.getCurrentSpace.pipe(
      switchMap((space) => {
        return this.workItemService.searchLinkWorkItem(term, space.id).pipe(
          map((items) => {
            return items
              .filter((item) => this.searchNotAllowedIds.indexOf(item.id) == -1)
              .map((item) => {
                return {
                  key: item.id,
                  value: `${item.attributes['system.number']} - ${item.attributes['system.title']}`,
                  selected: false,
                };
              });
          }),
        );
      }),
    );
  }

  createLinkObject(sourceId: string, targetId: string, linkId: string, linkType: string) {
    return {
      attributes: {
        version: 0,
      },
      relationships: {
        link_type: {
          data: {
            id: linkId,
            type: 'workitemlinktypes',
          },
        },
        source: {
          data: {
            id: linkType === 'forward' ? sourceId : targetId,
            type: 'workitems',
          },
        },
        target: {
          data: {
            id: linkType === 'reverse' ? sourceId : targetId,
            type: 'workitems',
          },
        },
      },
      type: 'workitemlinks',
    };
  }
}
