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
