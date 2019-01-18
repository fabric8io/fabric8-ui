import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { normalizeArray } from '../models/common.model';
import * as CollaboratorActions from './../actions/collaborator.actions';
import * as UserActions from './../actions/user.actions';
import { UserMapper, UserService as UserServiceModel, UserUI } from './../models/user';
import { ErrorHandler } from './work-item-utils';

export type CollabGetSuccess = CollaboratorActions.GetSuccess;
export type UserAction = UserActions.All;
export type UserGetAction = UserActions.Get;

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private notifications: Notifications,
    private errHandler: ErrorHandler,
  ) {}

  @Effect() getUser$: Observable<UserAction> = this.actions$.pipe(
    ofType(UserActions.GET),
    switchMap((action: UserGetAction) => {
      return this.userService.getUserByUserId(action.payload).pipe(
        map((user: UserServiceModel) => {
          const userMapper = new UserMapper();
          const mappedUser: UserUI = userMapper.toUIModel(user);
          return new UserActions.Set(normalizeArray<UserUI>([mappedUser]));
        }),
      );
    }),
    catchError((err) =>
      this.errHandler.handleError<UserAction>(
        err,
        `Problem in user details`,
        new UserActions.GetError(),
      ),
    ),
  );
}
