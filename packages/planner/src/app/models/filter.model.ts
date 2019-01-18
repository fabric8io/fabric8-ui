export class FilterModel {
  attributes: FilterAttributes;
  type: string;
}

export class FilterAttributes {
  description: string;
  key: string;
  query: string;
  title: string;
  type: string;
}
