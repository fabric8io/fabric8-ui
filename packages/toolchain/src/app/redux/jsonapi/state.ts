import { ErrorObject, ResourceObject } from '../../api/models/jsonapi';
import { SpaceResource, UserResource, FeatureResource, ResourceResource } from '../../api/models';

export type JsonapiState = {
  entities: {
    spaces?: {
      [id: string]: Entity<SpaceResource>;
    };
    identities?: {
      [id: string]: Entity<UserResource>;
    };
    features?: {
      [id: string]: Entity<FeatureResource>;
    };
    resources?: {
      [id: string]: Entity<ResourceResource>;
    };
  };
  collections: { [id: string]: Collection };
};

export interface Entity<R extends ResourceObject> {
  id: string;
  type: string;
  lastUpdated: number;
  isFetching?: boolean;
  didInvalidate?: boolean;
  resource?: R;
  error?: ErrorObject;
}

export interface Collection {
  url: string;
  totalCount: number;
  lastUpdated: number;
  pageInfo?: PageInfo;
  isFetching?: boolean;
  didInvalidate?: boolean;
  entities?: EntityRef[];
  error?: ErrorObject;
}

export interface PageInfo {
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  nextPage?: string;
  prevPage?: string;
  isFetchingPrevPage?: boolean;
  isFetchingNextPage?: boolean;
}

export interface EntityRef {
  type: string;
  id: string;
  self?: string;
}
