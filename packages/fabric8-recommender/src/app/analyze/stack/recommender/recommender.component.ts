import { Component, Input } from '@angular/core';

@Component({
    selector: 'f8-recommender',
    templateUrl: './recommender.html',
    styleUrls: ['./recommender.scss']
})

export class RecommenderComponent {

    @Input() recommendations;
    private recommendationsList: Array<any> = [];

    constructor() {}

    ngOnInit() {
        if (this.recommendations) {
            let length: number = this.recommendations.length;
            let recommendation: any, eachOne: any;
            for (let i: number = 0; i < length; ++ i) {
                recommendation = {};
                eachOne = this.recommendations[i];
                recommendation['suggestion'] = eachOne['suggestion'];
                recommendation['action'] = eachOne['action'];
                recommendation['message'] = eachOne['message'];

                this.recommendationsList.push(recommendation);
            }
        }
    }

}
