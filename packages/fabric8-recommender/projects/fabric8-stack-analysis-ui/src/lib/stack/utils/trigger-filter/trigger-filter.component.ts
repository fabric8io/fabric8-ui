import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';

@Component({
    selector: 'trigger-filter',
    styleUrls: ['./trigger-filter.component.less'],
    templateUrl: './trigger-filter.component.html'
})
export class TriggerFilterComponent implements OnChanges {
    @Input() message: string;
    @Input() filterBy: string;

    @Output() filter: EventEmitter<any> = new EventEmitter();

    ngOnChanges(): void {

    }

    handleClick(): void {
        this.filter.emit({
            filterBy: this.filterBy
        });
    }
}
