import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'selectedItems',
    pure: false
})
export class SelectedItemsPipe implements PipeTransform {
  transform(items: any[], args: any[]): any {
      return items.filter(item => item.selected === true);
  }
}
