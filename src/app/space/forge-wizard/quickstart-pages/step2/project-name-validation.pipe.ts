import { Pipe , PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNameError',
  pure: false
})
export class FormatNameValidationPipe implements PipeTransform {
  transform(items: any, args: any[]): any {
    if (items['pattern']) {
      return 'should not contain uppercase or special characters.';
    }
    if (items['required']) {
      return 'is required.';
    }
    if (items['minlength']) {
      return 'should contain at least 2 characters.';
    }
    if (items['maxlength']) {
      return 'should contain at most 63 characters.';
    }
    return items;
  }
}
