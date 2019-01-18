import * as states from './index.state';

export interface AppState {
  planner?: PlannerState;

  listPage?: ListPage;

  boardView?: BoardViewState;

  iterationPanel: {
    iterationUI: states.IterationUIState;
  };

  detailPage: DetailPageState;

  toolbar: {
    filters: states.FilterState;
  };

  workItemLink: {
    workItems: states.WorkItemState;
  };
}

export interface BoardViewState {
  boards: states.BoardState;
  columnWorkItem: states.ColumnWorkItemState;
  boardUi: states.BoardUIState;
}

export interface ListPage {}

export interface PlannerState {
  iterations: states.IterationState;
  labels: states.LabelState;
  areas: states.AreaState;
  collaborators: states.CollaboratorState;
  users: states.UserState;
  customQueries: states.CustomQueryState;
  groupTypes: states.GroupTypeState;
  space: states.SpaceState;
  workItems: states.WorkItemState;
  workItemStates: states.WIState;
  workItemTypes: states.WorkItemTypeState;
  infotips: states.InfotipState;
}

export interface DetailPageState {
  comments: states.CommentState;
  workItem: states.DetailWorkItemState;
  linkType: states.LinkTypeState;
  workItemLink: states.WorkItemLinkState;
  events: states.EventState;
}
