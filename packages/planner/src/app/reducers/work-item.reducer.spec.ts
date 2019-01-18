import { cloneDeep } from 'lodash';
import * as WorkItemActions from './../actions/work-item.actions';
import { WorkItemUI } from './../models/work-item';
import { initialState as WorkItemInitialState } from './../states/work-item.state';
import { WorkItemReducer } from './work-item.reducer';

export type Action = WorkItemActions.All;

describe('WorkItemReduer: ', () => {
  let workItems: WorkItemUI[];
  let workItemState;

  beforeEach(() => {
    workItems = [
      {
        id: '1',
        title: 'Work Item 1',
        number: '1',
        createdAt: '00:00',
        updatedAt: '00:00',
        state: 'new',
        descriptionMarkup: 'Markup',
        descriptionRendered: '<p>Hello Word</p>',
        description: 'Hello Workd',
        version: 0,
        order: 1000,
        areaId: null,
        iterationId: null,
        assignees: null,
        creator: null,
        labels: null,
        comments: null,
        children: null,
        commentLink: '',
        childrenLink: '',
        hasChildren: false,
        parentID: '',
        link: '',
        WILinkUrl: '',
        treeStatus: 'collapsed',
        childrenLoaded: false,
        bold: false,
        createId: 1,
        type: null,
        eventLink: '',
        selected: false,
      },
    ];

    workItemState = {
      ids: ['1'],
      entities: {
        '1': {
          id: '1',
          title: 'Work Item 1',
          number: '1',
          createdAt: '00:00',
          updatedAt: '00:00',
          state: 'new',
          descriptionMarkup: 'Markup',
          descriptionRendered: '<p>Hello Word</p>',
          description: 'Hello Workd',
          version: 0,
          order: 1000,
          areaId: null,
          iterationId: null,
          assignees: null,
          creator: null,
          labels: null,
          comments: null,
          children: null,
          commentLink: '',
          childrenLink: '',
          hasChildren: false,
          parentID: '',
          link: '',
          WILinkUrl: '',
          treeStatus: 'collapsed',
          childrenLoaded: false,
          bold: false,
          createId: 1,
          type: null,
          eventLink: '',
          selected: false,
        },
      },
      nextLink: '',
    };
  });

  it('undefined action should return the default state', () => {
    const action = {} as Action;
    const state = WorkItemReducer(undefined, action);

    expect(state).toBe(WorkItemInitialState);
  });

  it('Initial state should be as empty state', () => {
    const initialState = {
      ids: [],
      entities: {},
      nextLink: '',
    };

    expect(WorkItemInitialState).toEqual(initialState);
  });

  it('GetSuccess action should return new state', () => {
    const action = new WorkItemActions.GetSuccess({ workItems: workItems, nextLink: '' });
    const state = WorkItemReducer(WorkItemInitialState, action);

    expect(state).toEqual(workItemState);
  });

  it('GetError action should return previous state', () => {
    const action = new WorkItemActions.GetSuccess({ workItems: workItems, nextLink: '' });
    const state = WorkItemReducer(WorkItemInitialState, action);

    const getErrorAction = new WorkItemActions.GetError();
    const newState = WorkItemReducer(state, getErrorAction);

    expect(newState).toEqual(state);
  });

  it('AddSuccess action should return new state', () => {
    const action = new WorkItemActions.AddSuccess(workItems[0]);
    const state = WorkItemReducer(WorkItemInitialState, action);

    expect(state).toEqual(workItemState);
  });

  it('AddError action should return the previous state', () => {
    const action = new WorkItemActions.GetSuccess({ workItems: workItems, nextLink: '' });
    const state = WorkItemReducer(WorkItemInitialState, action);

    const addErrorAction = new WorkItemActions.AddError();
    const newState = WorkItemReducer(state, addErrorAction);

    expect(newState).toEqual(state);
  });

  it('UpdateSuccess action should return updated state', () => {
    let workItemsClone = cloneDeep(workItems);
    workItemsClone[0].title = 'Work Item Updated';
    const action = new WorkItemActions.GetSuccess({ workItems: workItems, nextLink: '' });
    const state = WorkItemReducer(WorkItemInitialState, action);

    const updateSuccessAction = new WorkItemActions.UpdateSuccess(workItemsClone[0]);
    const newState = WorkItemReducer(state, updateSuccessAction);

    expect(newState.entities['1'].title).toEqual('Work Item Updated');
  });

  it('UpdateError action should return previous state', () => {
    const action = new WorkItemActions.GetSuccess({ workItems: workItems, nextLink: '' });
    const state = WorkItemReducer(WorkItemInitialState, action);

    const updateErrorAction = new WorkItemActions.UpdateError();
    const newState = WorkItemReducer(state, updateErrorAction);

    expect(newState).toEqual(state);
  });

  it('GetChildrenSuccess action should return new state', () => {
    const children: WorkItemUI[] = [
      {
        id: '2',
        title: 'Work Item 2',
        number: '2',
        createdAt: '00:00',
        updatedAt: '00:00',
        state: 'new',
        descriptionMarkup: 'Markup',
        descriptionRendered: '<p>Hello Word</p>',
        description: 'Hello Workd',
        version: 0,
        order: 1001,
        areaId: null,
        iterationId: null,
        assignees: null,
        creator: null,
        labels: null,
        comments: null,
        children: null,
        commentLink: '',
        childrenLink: '',
        hasChildren: false,
        parentID: '1',
        link: '',
        WILinkUrl: '',
        treeStatus: 'disabled',
        childrenLoaded: false,
        bold: false,
        createId: 1,
        type: null,
        selected: false,
        eventLink: '',
      },
    ];
    const action = new WorkItemActions.GetSuccess({ workItems: workItems, nextLink: '' });
    const state = WorkItemReducer(WorkItemInitialState, action);

    const getChildrenSuccessAction = new WorkItemActions.GetChildrenSuccess({
      parent: workItems[0],
      children: children,
    });
    const newState = WorkItemReducer(state, getChildrenSuccessAction);

    expect(newState.entities[1].childrenLoaded).toBe(true);
    expect(newState.entities[1].treeStatus).toBe('expanded');
  });

  it('GetChildrenError action should return previous state', () => {
    const action = new WorkItemActions.GetSuccess({ workItems: workItems, nextLink: '' });
    const state = WorkItemReducer(WorkItemInitialState, action);

    const GetChildrenErrorAction = new WorkItemActions.GetChildrenError(workItems[0]);
    const newState = WorkItemReducer(state, GetChildrenErrorAction);

    expect(newState.entities[1].treeStatus).toBe('collapsed');
  });

  it('createLink action should return new state', () => {
    let workItem1: WorkItemUI = {
      id: '2',
      title: 'Work Item 1',
      number: '2',
      createdAt: '00:00',
      updatedAt: '00:00',
      state: 'new',
      descriptionMarkup: 'Markup',
      descriptionRendered: '<p>Hello Word</p>',
      description: 'Hello Workd',
      version: 0,
      order: 1000,
      areaId: null,
      iterationId: null,
      assignees: null,
      creator: null,
      labels: null,
      comments: null,
      children: null,
      commentLink: '',
      childrenLink: '',
      hasChildren: false,
      parentID: '',
      link: '',
      WILinkUrl: '',
      treeStatus: 'disabled',
      childrenLoaded: false,
      bold: false,
      createId: 1,
      type: null,
      eventLink: '',
      selected: false,
    };

    let workItems1 = cloneDeep(workItems);
    workItems1.push(workItem1);
    const action = new WorkItemActions.GetSuccess({ workItems: workItems1, nextLink: '' });
    const state = WorkItemReducer(WorkItemInitialState, action);

    const createLinkAction = new WorkItemActions.CreateLink({
      source: workItems1[0],
      target: workItems1[1],
      sourceTreeStatus: 'disabled',
    });
    const newState = WorkItemReducer(state, createLinkAction);
    expect(newState.entities['1'].treeStatus).toBe('collapsed');
    expect(newState.entities['1'].hasChildren).toBe(true);
    expect(newState.ids.length).toBe(1);
  });

  it('DeleteLink action should return new state', () => {
    let workItem1: WorkItemUI = {
      id: '2',
      title: 'Work Item 1',
      number: '2',
      createdAt: '00:00',
      updatedAt: '00:00',
      state: 'new',
      descriptionMarkup: 'Markup',
      descriptionRendered: '<p>Hello Word</p>',
      description: 'Hello Workd',
      version: 0,
      order: 1000,
      areaId: null,
      iterationId: null,
      assignees: null,
      creator: null,
      labels: null,
      comments: null,
      children: null,
      commentLink: '',
      childrenLink: '',
      hasChildren: false,
      parentID: '',
      link: '',
      WILinkUrl: '',
      treeStatus: 'disabled',
      childrenLoaded: false,
      bold: false,
      createId: 1,
      type: null,
      eventLink: '',
      selected: false,
    };

    let workItems1 = cloneDeep(workItems);
    workItems1.push(workItem1);
    const action = new WorkItemActions.GetSuccess({ workItems: workItems1, nextLink: '' });
    const state = WorkItemReducer(WorkItemInitialState, action);
    const createLinkAction = new WorkItemActions.CreateLink({
      source: workItems1[0],
      target: workItems1[1],
      sourceTreeStatus: 'disabled',
    });
    const newState = WorkItemReducer(state, createLinkAction);
    expect(newState.entities[1].parentID).toBe('');
  });
});
