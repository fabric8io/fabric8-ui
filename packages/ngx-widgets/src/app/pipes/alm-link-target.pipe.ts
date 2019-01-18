import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'almLinkTarget' })
export class AlmLinkTarget implements PipeTransform {
  transform(links: any, workItem: any, linkType: any): any {
    let result = '';
    // var linkType = args[1];
    if (
      links.relationships.source.data.id === workItem.id &&
      links.relationships.link_type.data.id === linkType.id
    ) {
      result = links.relationships.target.data.id;
    } else if (
      links.relationships.target.data.id === workItem.id &&
      links.relationships.link_type.data.id === linkType.id
    ) {
      result = links.relationships.source.data.id;
    }
    return result;
  }
}
