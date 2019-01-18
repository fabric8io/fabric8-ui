export class CustomQueryModel {
  id?: string;
  attributes: CustomQueryAttributes;
  type: string;
  selected?: boolean;
}
export class CustomQueryAttributes {
  fields: string;
  title: string;
}

export interface CustomQueryService extends CustomQueryModel {}
