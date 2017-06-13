export type FieldWidgetClassification = 'singleSelectionDropdown' | 'singleSelectionList' | 'multipleSelection' | 'singleInput' | 'filteredDropdown';

export class FieldWidgetClassificationOptions {
  //noinspection TsLint
  static SingleSelectionDropdown: FieldWidgetClassification = 'singleSelectionDropdown';
  //noinspection TsLint
  static FilteredDropdown: FieldWidgetClassification = 'filteredDropdown';
  //noinspection TsLint
  static SingleSelectionList: FieldWidgetClassification = 'singleSelectionList';
  //noinspection TsLint
  static MultipleSelection: FieldWidgetClassification = 'multipleSelection';
  //noinspection TsLint
  static SingleInput: FieldWidgetClassification = 'singleInput';
}
