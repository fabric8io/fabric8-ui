import { Pipe, PipeTransform } from '@angular/core';
import { sortBy } from 'lodash';

@Pipe({ name: 'f8SortBy' })
export class F8SortByPipe implements PipeTransform {
  transform(value: string, key: string) {
    return sortBy(value, key);
  }
}
