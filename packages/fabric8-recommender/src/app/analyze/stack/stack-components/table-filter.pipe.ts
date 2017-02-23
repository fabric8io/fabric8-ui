import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'filter'
})

@Injectable()
export class TableFilter implements PipeTransform {
    public transform(items: Array<any>, field: string, value: string): Array<any> {
        if (!items) {
            return [];
        } if (!field || !value) {
            return items;
        }
        return items.filter(item => item[field.toLowerCase()].includes(value.toLowerCase()));
    }
}
