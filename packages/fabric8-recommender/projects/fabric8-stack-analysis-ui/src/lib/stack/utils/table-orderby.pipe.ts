import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderBy'
})

@Injectable()
export class TableOrderByPipe implements PipeTransform {
    public transform(items: Array<any>, fieldName: string, direction: string): Array<any> {
        let newItems: Array<any> = items.sort((a: any, b: any) => {
            if (direction.toLowerCase() === 'up') {
                return a[fieldName] < b[fieldName] ? -1 : 1;
            } else {
                return a[fieldName] > b[fieldName] ? -1 : 1;
            }
        });
        return newItems;
    }
}
