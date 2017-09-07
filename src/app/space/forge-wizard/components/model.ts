export type FieldWidgetClassification = 'singleSelectionDropdown' | 'singleSelectionList' | 'multipleSelection' | 'singleInput';

export class FieldWidgetClassificationOptions {
  //noinspection TsLint
  static SingleSelectionDropdown: FieldWidgetClassification = 'singleSelectionDropdown';
  //noinspection TsLint
  static SingleSelectionList: FieldWidgetClassification = 'singleSelectionList';
  //noinspection TsLint
  static MultipleSelection: FieldWidgetClassification = 'multipleSelection';
  //noinspection TsLint
  static SingleInput: FieldWidgetClassification = 'singleInput';
}
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
export interface IFieldMessage {
  description: string;
  input: string;
  severity: string;
  showError: boolean;
}

export interface IField {
  name: string;
  value: string | Array<string>;
  valueType?: string;
  display: {
    choices?: Array<IFieldChoice>;
    hasChoices: boolean;
    inputType: FieldWidgetClassification;
    label: string;
    description: string;
    enabled: boolean;
    readonly: boolean;
    required: boolean;
    visible: boolean;
    index: number;
    note?: string;
    text?: string;
    message?: IFieldMessage;
    // other dynamic properties
    [key: string]: any;
  };
  // other dynamic properties
  [key: string]: any;
}
