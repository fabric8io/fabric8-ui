import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/*
 * Usage:
 *   <span [innerHTML]="timestamp | almMomentTime"></span>
 */

@Pipe({ name: 'almMomentTime' })
export class AlmMomentTime implements PipeTransform {
  transform(val: string): any {
    if (!val) {
      return '';
    }

    const aMonthAgo = new Date();
    aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);
    const dateValue = new Date(val);
    if (dateValue < aMonthAgo) {
      return `<span title="${moment(val).format('LLL')}">
                ${moment(val).format('D MMM YYYY')}
              </span>`;
    }
    return `<span title="${moment(val).format('LLL')}">
              ${moment(val, [moment.ISO_8601]).fromNow()}
            </span>`;
  }
}
