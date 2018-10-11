import { FilterService, WorkItem } from 'fabric8-planner';

export function filterOutClosedItems(items) {
  return items.filter(item => {
    // filter out items which has state closed or done or removed
    return [
      'removed',
      'closed',
      'done'
    ].indexOf(item.attributes['system.state'].toLowerCase()) === -1;
  });
}

export function buildAssigneeQuery(filterService: FilterService, userId) {
  return filterService.queryJoiner(
    {},
    filterService.and_notation,
    filterService.queryBuilder(
      'assignee', filterService.equal_notation, userId
    )
  );
}

export function buildSpaceQuery(filterService: FilterService, spaceId) {
  return filterService.queryBuilder(
    'space', filterService.equal_notation, spaceId
  );
}

export function buildClosedWorkItemQuery(filterService: FilterService) {
  let stateQuery = {};
  ['closed', 'Done', 'Removed', 'Closed'].forEach((state: string) => {
    stateQuery = filterService.queryJoiner(
      stateQuery,
      filterService.and_notation,
      filterService.queryBuilder(
        'state', filterService.not_equal_notation, state
      )
    );
  });
  return stateQuery;
}

export class WorkItemsData {
  workItems: WorkItem[];
  nextLink: string;
  totalCount?: number | null;
  included?: WorkItem[] | null;
  ancestorIDs?: Array<string>;
}
