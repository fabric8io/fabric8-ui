import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'f8RootIteration' })
export class F8RootIteration implements PipeTransform {
  transform(value: string) {
    return (
      '/' +
      value
        .split('/')
        .slice(2)
        .join('/')
    );
  }
}
