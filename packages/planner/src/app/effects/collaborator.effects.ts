import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { normalizeArray } from '../models/common.model';
import { SpaceQuery } from '../models/space';
import * as CollaboratorActions from './../actions/collaborator.actions';
import * as UserActions from './../actions/user.actions';
import { UserMapper, UserService as UserServiceModel, UserUI } from './../models/user';
import { CollaboratorService as CollabService } from './../services/collaborator.service';
import { ErrorHandler, filterTypeWithSpace } from './work-item-utils';

export type Action = CollaboratorActions.All | UserActions.All;

@Injectable()
export class CollaboratorEffects {
  constructor(
    private actions$: Actions,
    private collaboratorService: CollabService,
    private spaceQuery: SpaceQuery,
    private errHandler: ErrorHandler,
  ) {}

  @Effect() getCollaborators$: Observable<Action> = this.actions$.pipe(
    filterTypeWithSpace(CollaboratorActions.GET, this.spaceQuery.getCurrentSpace),
    switchMap(([action, space]) => {
      return this.collaboratorService.getCollaborators(
        space.links.self + '/collaborators?page[offset]=0&page[limit]=1000',
      );
    }),
    map((collaborators: UserServiceModel[]) => {
      const collabM = new UserMapper();
      return collaborators
        .map((c) => collabM.toUIModel(c))
        .sort((c1, c2) => (c1.name > c2.name ? 1 : 0));
    }),
    switchMap((collaborators) => {
      return [
        new CollaboratorActions.GetSuccess(collaborators.map((c) => c.id)),
        new UserActions.Set(normalizeArray<UserUI>(collaborators)),
      ];
    }),
    catchError((err) =>
      this.errHandler.handleError<Action>(
        err,
        'Problem in fetching collaborators',
        new CollaboratorActions.GetError(),
      ),
    ),
  );
}
