import { Pipe, PipeTransform } from '@angular/core';

/**
 * pipe to filter an array
 */

@Pipe({ name: 'filterColumn', pure: true })
export class FilterColumn implements PipeTransform {
  transform(columns: any[], param: string): any[] {
    return columns.filter((col) => col[param]);
  }
}
