import { ResourceObject, ResourceIdentifierObject, RelationshipsObject } from './jsonapi';

export type SpaceType = 'spaces';

export interface SpaceAttributes {
  /**
   * When the space was created
   */
  'created-at': Date;

  /**
   * Description for the space
   */
  description?: string;

  /**
   * Name for the space
   */
  name: string;

  /**
   * When the space was updated
   */
  'updated-at': string;

  /**
   * Version for optimistic concurrency control (optional during creating)
   */
  version: number;
}

export interface SpaceResource extends ResourceObject<SpaceAttributes, SpaceType> {
  relationships:
    | RelationshipsObject
    | {
        'owned-by': {
          data: ResourceIdentifierObject<'identifies'>;
        };
      };
}
