import {Component, ViewEncapsulation, Input} from '@angular/core';

@Component({
    selector: 'stack-recommendation',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './stack-recommendation.html',
    styleUrls: ['stack-recommendation.scss']
})

export class StackRecommendationComponent {

    @Input() headers;
    @Input() rows;

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

}