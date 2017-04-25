import { FieldWidgetClassification } from './field-classification';
import { IFieldChoice } from './field-value-option';
import { IFieldMessage } from './field-message';

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
    required: boolean;
    visible: boolean;
    index: number;
    note?: string;
    text?: string;
    message?: IFieldMessage | string;
    // other dynamic properties
    [key: string]: any;
  };
  // other dynamic properties
  [key: string]: any;
}
