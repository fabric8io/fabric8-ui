import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stageTime', pure: true })
export class StageTimePipe implements PipeTransform {
  transform(value: string): any {
    if (typeof value === 'number') {
      let seconds: number = Math.floor(value as number / 1000);
      let minutes = 0;
      if (seconds < 0) {
        seconds = 0;
      }
      for (; seconds >= 60; seconds = seconds - 60) {
        minutes++;
      }
      let res = '';
      if (minutes > 0) {
        res = `${minutes}m `;
      }
      res += `${seconds}s`;
      return res;
    }
  }
}
