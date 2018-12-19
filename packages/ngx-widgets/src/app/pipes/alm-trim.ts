import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'almTrim' })
export class AlmTrim implements PipeTransform {
  transform(val: string): any {
    if (!val) {
      return '';
    } else {
      return val.trim();
    }
  }
}
