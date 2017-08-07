export interface INotifyPropertyChanged<T> {
  previousValue: T;
  currentValue: T;
  isFirstChange: boolean;
}
