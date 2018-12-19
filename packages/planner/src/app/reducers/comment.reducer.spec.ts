import * as CommentActions from './../actions/comment.actions';
import { CommentUI } from './../models/comment';
import { CommentReducer } from './comment.reducer';

import { initialState as CommentInitialState } from './../states/comment.state';

export type Action = CommentActions.All;

describe('CommentReducer:', () => {
  let comments: CommentUI[];
  beforeEach(() => {
    comments = [
      {
        id: '1',
        body: 'comment 1',
        markup: 'MarkUp',
        createdAt: '00:00',
        creatorId: '1',
        bodyRendered: '<p>comment 1</p>',
        parentId: null,
        selfLink: '/',
      },
      {
        id: '2',
        body: 'comment 2',
        markup: 'MarkUp',
        createdAt: '00:00',
        creatorId: '1',
        bodyRendered: '<p>comment 2</p>',
        parentId: null,
        selfLink: '/',
      },
    ];
  });

  it('undefined action should return the default state', () => {
    const action = {} as Action;
    const state = CommentReducer(undefined, action);

    expect(state).toBe(CommentInitialState);
  });

  it('Initial state should be an empty array', () => {
    const initialState = [];
    expect(CommentInitialState).toEqual(initialState);
  });

  it('GetSuccess action should return new state', () => {
    const action = new CommentActions.GetSuccess(comments);
    const state = CommentReducer(CommentInitialState, action);

    expect(state).toEqual(comments);
  });

  it('GetError Actions should return previous state', () => {
    const action = new CommentActions.GetError();
    const state = CommentReducer(comments, action);

    expect(comments).toEqual(state);
  });

  it('AddSuccess actions should retrun the updated state', () => {
    const newComment: CommentUI = {
      id: '3',
      body: 'comment 3',
      markup: 'MarkUp',
      createdAt: '00:00',
      creatorId: '1',
      bodyRendered: '<p>comment 3</p>',
      parentId: null,
      selfLink: '/',
    };

    const newCommentState: CommentUI[] = [
      {
        id: '3',
        body: 'comment 3',
        markup: 'MarkUp',
        createdAt: '00:00',
        creatorId: '1',
        bodyRendered: '<p>comment 3</p>',
        parentId: null,
        selfLink: '/',
      },
      {
        id: '1',
        body: 'comment 1',
        markup: 'MarkUp',
        createdAt: '00:00',
        creatorId: '1',
        bodyRendered: '<p>comment 1</p>',
        parentId: null,
        selfLink: '/',
      },
      {
        id: '2',
        body: 'comment 2',
        markup: 'MarkUp',
        createdAt: '00:00',
        creatorId: '1',
        bodyRendered: '<p>comment 2</p>',
        parentId: null,
        selfLink: '/',
      },
    ];

    const getSuccessAction = new CommentActions.GetSuccess(comments);
    const state = CommentReducer(CommentInitialState, getSuccessAction);

    const addSuccessAction = new CommentActions.AddSuccess(newComment);
    const newState = CommentReducer(state, addSuccessAction);

    expect(newState).toEqual(newCommentState);
  });

  it('AddError action should return the previous state', () => {
    const getSuccessAction = new CommentActions.GetSuccess(comments);
    const state = CommentReducer(CommentInitialState, getSuccessAction);

    const addErrorAction = new CommentActions.AddError();
    const newState = CommentReducer(state, addErrorAction);

    expect(newState).toEqual(state);
  });

  it('updateSuccess action should return updates state', () => {
    const updatedComment = {
      id: '1',
      body: 'This comment has been updated.',
      markup: 'MarkUp',
      createdAt: '00:00',
      creatorId: '1',
      bodyRendered: '<p>This comment has been updated.</p>',
      parentId: null,
      selfLink: '/',
    };

    const newState: CommentUI[] = [
      {
        id: '1',
        body: 'This comment has been updated.',
        markup: 'MarkUp',
        createdAt: '00:00',
        creatorId: '1',
        bodyRendered: '<p>This comment has been updated.</p>',
        parentId: null,
        selfLink: '/',
      },
      {
        id: '2',
        body: 'comment 2',
        markup: 'MarkUp',
        createdAt: '00:00',
        creatorId: '1',
        bodyRendered: '<p>comment 2</p>',
        parentId: null,
        selfLink: '/',
      },
    ];

    const getSuccessAction = new CommentActions.GetSuccess(comments);
    const state = CommentReducer(CommentInitialState, getSuccessAction);

    const updateSuccessAction = new CommentActions.UpdateSuccess(updatedComment);
    const updatedState = CommentReducer(state, updateSuccessAction);

    expect(updatedState).toEqual(newState);
  });

  it('updateError action should return previous state', () => {
    const getSuccessAction = new CommentActions.GetSuccess(comments);
    const state = CommentReducer(CommentInitialState, getSuccessAction);

    const updateErrorAction = new CommentActions.UpdateError();
    const newState = CommentReducer(state, updateErrorAction);

    expect(state).toEqual(newState);
  });

  it('deleteSuccess action should return new state', () => {
    const newCommentState = [
      {
        id: '2',
        body: 'comment 2',
        markup: 'MarkUp',
        createdAt: '00:00',
        creatorId: '1',
        bodyRendered: '<p>comment 2</p>',
        parentId: null,
        selfLink: '/',
      },
    ];

    const getSuccessAction = new CommentActions.GetSuccess(comments);
    const state = CommentReducer(CommentInitialState, getSuccessAction);

    const deleteSuccessAction = new CommentActions.DeleteSuccess(comments[0]);
    const newState = CommentReducer(state, deleteSuccessAction);

    expect(newState).toEqual(newCommentState);
  });

  it('deleteError action should return previous state', () => {
    const getSuccessAction = new CommentActions.GetSuccess(comments);
    const state = CommentReducer(CommentInitialState, getSuccessAction);

    const deleteErrorAction = new CommentActions.DeleteError();
    const newState = CommentReducer(state, deleteErrorAction);

    expect(newState).toEqual(newState);
  });
});
