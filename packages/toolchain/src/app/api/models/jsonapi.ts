export type MetaObject = { [key: string]: any };

export interface DocumentBase {
  jsonapi?: ImplementationInfo;
  links?: Links & PaginationLinks;
  meta?: MetaObject;
}

export interface ImplementationInfo {
  version?: string;
  meta?: MetaObject;
}

export interface MetaDocument extends DocumentBase {
  meta: MetaObject;
}

export interface ErrorsDocument extends DocumentBase {
  errors: ErrorObject[];
}

export interface DataDocument<A = {}, T extends string = string> extends DocumentBase {
  data: ResourceObject<A, T> | ResourceObject<A, T>[];
  included?: Included;
}

export type Included = ResourceObject[];

export type Document = DataDocument | MetaDocument | ErrorsDocument;

export type AttributesObject = { [key: string]: any };

export interface ResourceObject<
  A extends AttributesObject = AttributesObject,
  T extends string = string
> {
  id: string;
  type: T;
  attributes?: A;
  relationships?: RelationshipsObject;
  links?: Links;
  meta?: MetaObject;
}

export interface ResourceIdentifierObject<T extends string = string> {
  id: string;
  type: T;
  meta?: MetaObject;
}

export type ResourceLinkage<T extends string = string> =
  | null
  | never[]
  | ResourceIdentifierObject<T>
  | ResourceIdentifierObject<T>[];

interface BaseRelationship<T extends string = string> {
  links?: Links;
  data?: ResourceLinkage<T>;
  meta?: MetaObject;
}

export interface RelationshipsWithLinks extends BaseRelationship {
  links: Links;
}

export interface RelationshipsWithData<T extends string = string> extends BaseRelationship<T> {
  data: ResourceLinkage<T>;
}

export interface RelationshipsWithMeta extends BaseRelationship {
  meta: MetaObject;
}

export type RelationshipObject =
  | RelationshipsWithData
  | RelationshipsWithLinks
  | RelationshipsWithMeta;

export interface RelationshipsObject {
  [k: string]: RelationshipObject;
}

export interface SourceObject {
  pointer?: any;
  parameter?: string;
}

export interface ErrorObject {
  id?: number | string;
  links?: Links;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: SourceObject;
  meta?: MetaObject;
}

export type Errors = ErrorObject[];

export interface Links {
  self?: Link;
  related?: Link;
}

export interface LinkObject {
  href?: string;
  meta?: MetaObject;
}

export type Link = string | LinkObject;

export interface PaginationLinks {
  first?: string;
  last?: string;
  prev?: string;
  next?: string;
}
