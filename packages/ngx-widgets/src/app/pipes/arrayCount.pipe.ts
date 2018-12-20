import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayCount',
  pure: false,
})
export class ArrayCount implements PipeTransform {
  transform(objArray: Array<any>) {
    if (objArray instanceof Array === false) {
      return null;
    }

    return objArray.length;
  }
}
