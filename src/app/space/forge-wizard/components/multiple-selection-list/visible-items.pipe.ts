import { Pipe , PipeTransform } from '@angular/core';

@Pipe({
    name: 'visibleItems',
    pure: false
})
export class VisibleItemsPipe implements PipeTransform {
  transform(items: any[], args: any[]): any {
      return items.filter(item => item.visible === true);
  }
}
