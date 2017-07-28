import {PipeTransform, Pipe} from '@angular/core';

export class Entry {
  constructor(public key: string, public value: string) {
  }
}

/**
 * Creates an array of entries from the given map
 */
export function createEntryArray(labels: Map<string,string>): Array<Entry> {
  let entries = new Array<Entry>();
  if (labels) {
    Object.keys(labels).forEach((k) => entries.push(new Entry(k, labels[k])));
  }
  return entries;
}

@Pipe({name: 'entries'})
export class EntriesPipe implements PipeTransform {
  transform(value: any): Object[] {
    let entries = [];
    if (value) {
      Object.keys(value).forEach((k) => entries.push(new Entry(k, value[k])));
    }
    return entries;
  }
}
