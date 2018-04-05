import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import {
  Notification,
  Notifications,
  NotificationType
} from 'ngx-base';
import { Space, SpaceAttributes, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
//import { SpaceNamespaceService } from '../runtime-console/space-namespace.service';
import * as SpaceActions from './../actions/space.actions';


@Injectable()
export class SpaceEffects {
  constructor(
    private actions$: Actions,
    private spaces: Spaces,
    private spaceService: SpaceService,
//    private spaceNamespaceService: SpaceNamespaceService,
    private notifications: Notifications
  ) {}

  @Effect() getSpace$: Observable<Action> = this.actions$
    .ofType(SpaceActions.GET)
    .switchMap(action => {
      return this.spaces.current
        .map((space: Space) => {
          return new SpaceActions.GetSuccess(space);
        })
        .catch(e => {
          try {
            this.notifications.message({
              message: `Problem in getting space`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem in getting space');
          }
          return Observable.of(new SpaceActions.GetError());
        });
    });

  @Effect() createSpace$: Observable<Action> = this.actions$
    .ofType(SpaceActions.ADD)
    .switchMap((action: Action) => {
      let newSpace = SpaceEffects.createTransientSpace((action as any).payload.spaceName, (action as any).payload.ownerId);
      return this.spaceService.create(newSpace)
        // TODO: ADD_SUCCESS should dispatch an UPDATE for spaceNamespace (once ngrx is implemented for spaceNamespace)
        // .switchMap(createdSpace => {
        //   return this.spaceNamespaceService
        //     .updateConfigMap(Observable.of(createdSpace))
        //     .map(() => createdSpace)
        //     .catch(err => Observable.of(createdSpace));
        // })
        .map((space: Space) => {
          return new SpaceActions.AddSuccess(space);
        })
        .catch(e => {
          if (e.status === 409) {
            let errorMessage: string;
            if (e._body) {
              let body = JSON.parse(e._body);
              if (body) {
                errorMessage = body.errors && body.errors.length > 0 ? body.errors[0].detail : 'Name already exists';
              }
            }
            return Observable.of(new SpaceActions.AddError({errorCode: e.status, errorMessage: errorMessage}));
          }
          try {
            this.notifications.message({
              message: `Problem in getting space`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem in getting space');
          }
          return Observable.of(new SpaceActions.AddError({errorCode: e.status, errorMessage: e.detail}));
        });
    });

  static createTransientSpace(name: string, ownerId: string): Space {
    let space = {} as Space;
    space.name = name;
    space.path = '';
    space.attributes = new SpaceAttributes();
    space.attributes.name = space.name;
    space.type = 'spaces';
    space.privateSpace = false;
    space.process = { name: '', description: '' };
    space.relationships = {
      areas: {
        links: {
          related: ''
        }
      },
      iterations: {
        links: {
          related: ''
        }
      },
      workitemtypegroups: {
        links: {
          related: ''
        }
      },
      'owned-by': {
        data: {
          id: ownerId,
          type: 'identities'
        }
      }
    };
    return space;
  }
}
