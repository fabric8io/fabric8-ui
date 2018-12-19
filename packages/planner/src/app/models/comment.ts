import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { User, UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
  Add as AddCommentAction,
  Get as GetCommentActions,
  Update as UpdateCommentAction,
} from './../actions/comment.actions';
import { AppState } from './../states/app.state';
import { cleanObject, Mapper, MapTree, modelService, switchModel } from './common.model';
import { UserMapper, UserQuery, UserUI } from './user';

export class Comment extends modelService {
  attributes: CommentAttributes;
  relationships: {
    creator?: {
      data: {
        id: string;
        type: string;
      };
    };
    parent?: {
      data: {
        id: string;
        type: string;
      };
    };
  };
  links: CommentLink;
  relationalData?: RelationalData;
}

export class CommentLink {
  self: string;
}

export class CommentAttributes {
  body: string;
  'body.rendered': string;
  'markup': string;
  'created-at': string;
}

export class Comments {
  data: Comment[];
}

export class RelationalData {
  creator?: User;
}

export interface CommentUI {
  id: string;
  body: string;
  markup: string;
  createdAt: string;
  creatorId: string;
  creator?: Observable<UserUI>;
  bodyRendered: string;
  selfLink: string;
  parentId: string;
  children?: CommentUI[];
  allowEdit?: boolean;
}

export interface CommentService extends Comment {}

export class CommentMapper implements Mapper<CommentService, CommentUI> {
  constructor() {}

  serviceToUiMapTree: MapTree = [
    {
      fromPath: ['id'],
      toPath: ['id'],
    },
    {
      fromPath: ['attributes', 'body'],
      toPath: ['body'],
    },
    {
      fromPath: ['attributes', 'markup'],
      toPath: ['markup'],
    },
    {
      fromPath: ['attributes', 'created-at'],
      toPath: ['createdAt'],
    },
    {
      fromPath: ['attributes', 'body.rendered'],
      toPath: ['bodyRendered'],
    },
    {
      fromPath: ['relationships', 'creator', 'data', 'id'],
      toPath: ['creatorId'],
    },
    {
      fromPath: ['links', 'self'],
      toPath: ['selfLink'],
    },
    {
      fromPath: ['relationships', 'parent-comment', 'data', 'id'],
      toPath: ['parentId'],
    },
  ];

  uiToServiceMapTree: MapTree = [
    {
      toPath: ['id'],
      fromPath: ['id'],
    },
    {
      toPath: ['attributes', 'body'],
      fromPath: ['body'],
    },
    {
      toPath: ['attributes', 'markup'],
      toValue: 'Markdown',
    },
    {
      toPath: ['attributes', 'created-at'],
      fromPath: ['createdAt'],
    },
    {
      toPath: ['attributes', 'body.rendered'],
      fromPath: ['bodyRendered'],
    },
    {
      toPath: ['type'],
      toValue: 'comments',
    },
    {
      toPath: ['links', 'self'],
      fromPath: ['selfLink'],
    },
    {
      toPath: ['relationships', 'parent-comment', 'data', 'id'],
      fromPath: ['parentId'],
    },
    {
      toPath: ['relationships', 'parent-comment', 'data', 'type'],
      fromPath: ['parentId'],
      toFunction: (v) => (!!v ? 'comments' : null),
    },
  ];

  toUIModel(arg: CommentService): CommentUI {
    return switchModel<CommentService, CommentUI>(arg, this.serviceToUiMapTree);
  }

  toServiceModel(arg: CommentUI): CommentService {
    return cleanObject(switchModel<CommentUI, CommentService>(arg, this.uiToServiceMapTree));
  }
}

@Injectable()
export class CommentQuery {
  private commentSource = this.store.pipe(
    select((state) => state.detailPage),
    select((state) => state.comments),
  );
  constructor(
    private store: Store<AppState>,
    private userQuery: UserQuery,
    private userService: UserService,
  ) {}

  getComments(commentIds: string[]) {
    // Not needed now
  }

  getCommentsWithCreators(): Observable<CommentUI[]> {
    return this.commentSource.pipe(
      map((comments) => {
        return comments.map((comment) => {
          return {
            ...comment,
            creator: this.userQuery.getUserObservableById(comment.creatorId),
          };
        });
      }),
      switchMap((comments) => {
        return this.userService.loggedInUser.pipe(
          map((user) => (user ? user : { id: '0' })),
          map((user) => {
            return comments.map((c) => {
              return { ...c, allowEdit: c.creatorId === user.id };
            });
          }),
        );
      }),
    );
  }

  getCommentsWithChildren(): Observable<CommentUI[]> {
    return this.getCommentsWithCreators().pipe(
      map((comments: CommentUI[]) => {
        return (
          comments
            .map((comment) => {
              return {
                ...comment,
                children: comments.filter((c) => c.parentId === comment.id),
              } as CommentUI;
            })
            // keep only the root comments
            .filter((comment) => !comment.parentId)
        );
      }),
    );
  }

  createComment(url: string, comment: CommentUI): void {
    const comMapper = new CommentMapper();
    this.store.dispatch(
      new AddCommentAction({
        comment: comMapper.toServiceModel(comment),
        url: url,
      }),
    );
  }

  updateComment(comment: CommentUI): void {
    const comMapper = new CommentMapper();
    this.store.dispatch(new UpdateCommentAction(comMapper.toServiceModel(comment)));
  }

  dispatchGet(url: string) {
    this.store.dispatch(new GetCommentActions(url));
  }
}
