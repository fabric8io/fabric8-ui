import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'filter'
})

/*
 *  A generic filter that gives you the filtered output
 *  on passing the key and value to be filtered upon
 *  Takes a key - fielname, and a value - fieldValue
 *  Returns the filtered Array of objects or anything
 *
 *  Name: 'filter'
 *  Usage:
 *
 *  Use as a pipe,
 *  In a loop:
 *  *ngFor="let something of (manythings | filter : fieldNameAsVariable {or 'simply name'} : fieldValueAsVariable {or 'simply value'})"
 */

@Injectable()
export class TableFilter implements PipeTransform {
    public transform(items: Array<any>, field: string): Array<any> {
        if (!items) {
            return [];
        } if (!field) {
            return items;
        }
        if (field === 'reset') {
            return items;
        }
        return items.filter(item => {
            return item[field] === true;
        });
    }
}
