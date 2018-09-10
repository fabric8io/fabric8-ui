import { WorkItem } from 'fabric8-planner';

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

export class WorkItemsData {
  workItems: WorkItem[];
  nextLink: string;
  totalCount?: number | null;
  included?: WorkItem[] | null;
  ancestorIDs?: Array<string>;
}
