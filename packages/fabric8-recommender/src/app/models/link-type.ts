import { LinkCategory } from './link-category';

export class LinkType {
  id: string;
  type: string;
  attributes: {
    'description': string
    'forward_name': string,
    'name': string,
    'reverse_name': string,
    'topology': string, 
    'version': number
  };
  relationships: {
    // 'link_category': LinkCategory,
    'link_category': {
      'data': {
        'id': string,
        'type': string
      }
    }
    'source_type': {
      'data': {
        'id': string,
        'type': string
      }
    },
    'target_type': {
      'data': {
        'id': string,
        'type': string
      }
    }
  };
}