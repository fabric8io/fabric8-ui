import { Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, select, Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { Profile, User, UserService as UserServiceClass } from 'ngx-login-client';
import { combineLatest, ConnectableObservable, Observable, of as ObservableOf } from 'rxjs';
import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Get as GetUserAction } from './../actions/user.actions';
import { AppState, PlannerState } from './../states/app.state';
import { Mapper, MapTree, modelService, modelUI, switchModel } from './common.model';

export interface UserService extends modelService {
  attributes?: Profile;
  links?: {
    self?: string;
    related?: string;
  };
}

export interface UserUI extends modelUI {
  avatar: string;
  username: string;
  currentUser: boolean;
}

@Injectable()
export class UserMapper implements Mapper<UserService, UserUI> {
  serviceToUiMapTree: MapTree = [
    {
      fromPath: ['id'],
      toPath: ['id'],
    },
    {
      fromPath: ['attributes', 'fullName'],
      toPath: ['name'],
    },
    {
      fromPath: ['attributes', 'imageURL'],
      toPath: ['avatar'],
    },
    {
      fromPath: ['attributes', 'username'],
      toPath: ['username'],
    },
    {
      toPath: ['currentUser'],
      toValue: false,
    },
  ];

  uiToServiceMapTree: MapTree = [
    {
      toPath: ['id'],
      fromPath: ['id'],
    },
    {
      toPath: ['attributes', 'fullName'],
      fromPath: ['name'],
    },
    {
      toPath: ['attributes', 'imageURL'],
      fromPath: ['avatar'],
    },
    {
      toPath: ['attributes', 'username'],
      fromPath: ['username'],
    },
    {
      toPath: ['type'],
      toValue: 'identities',
    },
  ];

  toUIModel(arg: UserService): UserUI {
    return switchModel<UserService, UserUI>(arg, this.serviceToUiMapTree);
  }

  toServiceModel(arg: UserUI): UserService {
    return switchModel<UserUI, UserService>(arg, this.uiToServiceMapTree);
  }
}

@Injectable()
export class UserQuery {
  constructor(private store: Store<AppState>, private userService: UserServiceClass) {}

  private plannerSelector = createFeatureSelector<PlannerState>('planner');
  private userSelector = createSelector(
    this.plannerSelector,
    (state) => state.users,
  );
  private userSource = this.store.pipe(select(this.userSelector));

  private collaboratorIdsSelector = createSelector(
    this.plannerSelector,
    (state) => state.collaborators,
  );

  private collaboratorSelector = createSelector(
    this.userSelector,
    this.collaboratorIdsSelector,
    (users, collabs) => (isEmpty(users) ? [] : collabs.map((c) => users[c])),
  );

  private collaboratorSource = this.store.pipe(select(this.collaboratorSelector));

  getUserObservableById(id: string): Observable<UserUI> {
    return (
      this.userSource
        // If the desired user doesn't exist then fetch it
        .pipe(
          select((users) => users[id]),
          tap((user) => {
            if (!user) {
              this.store.dispatch(new GetUserAction(id));
            }
          }),
          filter((user) => !!user), // filter the pipe based on availability of the user
        )
    );
  }

  getUserObservablesByIds(ids: string[] = []): Observable<UserUI[]> {
    if (!ids.length) {
      return ObservableOf([]);
    }
    return combineLatest(ids.map((id) => this.getUserObservableById(id))).pipe(
      // When a user is not there in the collaborator list
      // it fetches that particular user from API service
      // meanwhile the combine observables returns null if async pipe is used
      // We should return empty array instead
      startWith([]),
    );
  }

  getCollaborators(): Observable<UserUI[]> {
    return this.collaboratorSource.pipe(
      filter((c) => !!c.length),
      switchMap((collaborators) => {
        return this.userService.loggedInUser.pipe(
          map((u) => {
            return collaborators.map((c) => {
              return { ...c, currentUser: u ? c.id === u.id : false };
            });
          }),
        );
      }),
    );
  }

  /**
   * getCollaboratorAndLoggedInUserIds this function returns an
   * array of all the collaborators IDs and loggedIn user IDs
   */
  get getCollaboratorIds() {
    return this.store.pipe(select(this.collaboratorIdsSelector));
  }

  /**
   * This function returns the loggedInUser subject
   */
  get getLoggedInUser(): ConnectableObservable<User> {
    return this.userService.loggedInUser;
  }
}
