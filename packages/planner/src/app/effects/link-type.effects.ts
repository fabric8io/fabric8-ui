import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import * as LinkTypeActions from './../actions/link-type.actions';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LinkTypeUI } from './../models/link-type';
import { SpaceQuery } from './../models/space';
import { WorkItemService } from './../services/work-item.service';
import { filterTypeWithSpace } from './work-item-utils';

export type Action = LinkTypeActions.All;

@Injectable()
export class LinkTypeEffects {
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private spaceQuery: SpaceQuery,
  ) {}

  @Effect() getLinkTypes$: Observable<Action> = this.actions$.pipe(
    filterTypeWithSpace(LinkTypeActions.GET, this.spaceQuery.getCurrentSpace),
    map(([action, space]) => {
      return {
        payload: action,
        space: space,
      };
    }),
    switchMap((lt) => {
      return this.workItemService.getAllLinkTypes(lt.space.links.workitemlinktypes).pipe(
        map((data) => {
          let lts: any = {};
          let linkTypes: LinkTypeUI[] = [];
          lts['forwardLinks'] = data;
          lts['backwardLinks'] = data;
          lts.forwardLinks.forEach((linkType) => {
            linkTypes.push({
              name: linkType.attributes['forward_name'],
              id: linkType.id,
              linkType: 'forward',
              description: linkType.attributes['forward_description']
                ? linkType.attributes['forward_description']
                : linkType.attributes['description'],
            });
          });
          lts.backwardLinks.forEach((linkType) => {
            linkTypes.push({
              name: linkType.attributes['reverse_name'],
              id: linkType.id,
              linkType: 'reverse',
              description: linkType.attributes['reverse_description']
                ? linkType.attributes['reverse_description']
                : linkType.attributes['description'],
            });
          });
          return new LinkTypeActions.GetSuccess(linkTypes);
        }),
      );
    }),
  );
}
