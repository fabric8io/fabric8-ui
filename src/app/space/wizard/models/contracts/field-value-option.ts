export interface IFieldChoice {
  id: string;
  name: string;
  description?: string;
  selected: boolean;
  visible: boolean;
  index: number;
  isDefault: boolean;
  // Other dynamic properties
  [key: string]: any;
}
