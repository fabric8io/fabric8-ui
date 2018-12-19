import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayCount',
  pure: false,
})
export class ArrayCount implements PipeTransform {
  transform(objArray: Array<any>) {
    if (false === objArray instanceof Array) {
      return null;
    }

    return objArray.length;
  }
}
