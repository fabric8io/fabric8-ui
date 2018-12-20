import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'almArrayFilter', pure: false })
export class AlmArrayFilter implements PipeTransform {
  transform(arr: any[], compare: any): any {
    const compareKeys: any = Object.keys(compare);
    return arr.filter((item) => {
      for (let i = 0; i < compareKeys.length; i++) {
        if (item[compareKeys[i]] !== compare[compareKeys[i]]) {
          return false;
        }
        return true;
      }
      return false;
    });
  }
}
