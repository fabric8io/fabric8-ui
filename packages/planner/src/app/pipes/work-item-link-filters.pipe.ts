import { Pipe, PipeTransform } from '@angular/core';
import { WorkItem } from '../models/work-item';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({ name: 'workItemLinkFilterByTypeName', pure: true })
export class WorkItemLinkFilterByTypeName implements PipeTransform {
  transform(selectedLinkType: string, arr: any[]): any[] {
    if (selectedLinkType !== null && selectedLinkType !== 'all') {
      let outputArr: any[] = arr.filter((item) => item.linkName === selectedLinkType);
      return outputArr;
    }
    return arr;
  }
}

@Pipe({ name: 'groupWorkItemLinks', pure: true })
export class GroupWorkItemLinks implements PipeTransform {
  transform(arr: any[], workItemId: string): any[] {
    /**
     * [{
     *     linkType:
     *     linkDirection:
     *     workItems: workitem[]
     * }]
     *
     */
    let linkTypes = arr.reduce((ltypes, curr_val) => {
      if (ltypes.findIndex((ltype) => curr_val.linkType.id === ltype.id) === -1) {
        return [...ltypes, curr_val.linkType];
      } else {
        return [...ltypes];
      }
    }, []);

    let op = [];
    linkTypes.forEach((linkType) => {
      const linksOfLinkType = arr.filter((link) => link.linkType.id === linkType.id);
      let forward = [];
      let reverse = [];
      let forwardLinks = [];
      let reverseLinks = [];
      linksOfLinkType.forEach((link) => {
        if (link.source.id === workItemId) {
          forward.push({ ...link.target, ...{ newlyAdded: link.newlyAdded } });
          forwardLinks.push(link);
        }
        if (link.target.id === workItemId) {
          reverse.push({ ...link.source, ...{ newlyAdded: link.newlyAdded } });
          reverseLinks.push(link);
        }
      });
      if (forward.length) {
        op.push({
          linkType: linkType,
          linkDirection: 'forwardName',
          workItems: forward,
          links: forwardLinks,
        });
      }
      if (reverse.length) {
        op.push({
          linkType: linkType,
          linkDirection: 'reverseName',
          workItems: reverse,
          links: reverseLinks,
        });
      }
    });
    return op;
  }
}

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({ name: 'workItemLinkTypeFilterByTypeName', pure: true })
export class WorkItemLinkTypeFilterByTypeName implements PipeTransform {
  transform(selectedLinkType: string, arr: any[]): any[] {
    if (selectedLinkType !== 'all') {
      let outputArr: any[] = arr.filter((item) => item.name === selectedLinkType);
      return outputArr;
    }
    return arr;
  }
}
