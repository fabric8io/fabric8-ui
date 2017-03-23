import { IFieldValueOption} from './field-value-option'; 
import { FieldWidgetClassification} from './field-classification'; 

export interface IFieldInfo {
  name: string;
  value:string | Array<string>;
  valueType?:string;
  display: {
    options?: Array<IFieldValueOption>;
    hasOptions: boolean;
    inputType: FieldWidgetClassification;
    label: string;
    enabled: boolean;
    required: boolean;
    visible: boolean;
    index: number;
    // other dynamic properties
    [key: string]: any;
  }
  // other dynamic properties
  [key: string]: any;
}