import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'f8Time' })
export class F8TimePipe implements PipeTransform {
  transform(value: string) {
    // TODO: add support for weeks
    // const dateObject = moment(value).toObject();
    // const dateArray = moment(value).toArray();
    return moment(value).fromNow();
  }
}
