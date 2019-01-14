import { ResourceObject } from './jsonapi';

export type ResourceType = 'resources';

export interface ResourceAttributes {
  name?: string;
}

export interface ResourceResource extends ResourceObject<ResourceAttributes, ResourceType> {
  links: {
    self: string;
  };
}
