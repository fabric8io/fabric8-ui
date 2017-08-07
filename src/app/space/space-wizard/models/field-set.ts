import { IField } from './contracts/field-info';
import { IFieldCollection } from './contracts/field-set';

export { IFieldCollection } from './contracts/field-set';
export { IField } from './contracts/field-info';
export { IFieldChoice } from './contracts/field-value-option';

export {
  FieldWidgetClassification,
  FieldWidgetClassificationOptions
} from './contracts/field-classification';

export class FieldCollection extends Array<IField> implements IFieldCollection {
}
