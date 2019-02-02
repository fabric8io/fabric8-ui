import { Pipe } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncateCharactersPipe {
  transform(value: string, limit: number = 40, trail: String = '…'): string {
    if (!value) {
      return '';
    }
    if (limit < 0) {
      let l = limit;
      l *= -1;
      return value.length > l ? trail + value.substring(value.length - l, value.length) : value;
    }
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
