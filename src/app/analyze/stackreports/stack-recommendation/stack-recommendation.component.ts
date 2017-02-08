import {Component, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'stack-recommendation',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './stack-recommendation.html',
    styleUrls: ['stack-recommendation.scss']
})

export class StackRecommendationComponent {

    @Input() headers;
    @Input() rows;

    @Output() customEvent = new EventEmitter();

    //private headers : Array<string> = [];
    //private rows : Array<any> = [];

    constructor() {

        /*this.headers = [
            'name',
            'version'
        ];

        this.rows = [
            { name: 'Sample1', version: '0.1.1' },
            { name: 'Sample1', version: '0.1.1' },
            { name: 'Sample1', version: '0.1.1' },
            { name: 'Sample1', version: '0.1.1' }
        ];*/

    }

      /* Add Workflow */
  eventHandler(row) : void {
    this.customEvent.emit(row);
  }

}