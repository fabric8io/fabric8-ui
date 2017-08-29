import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
    selector: 'f8-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
    public stackUrl: string = 'https://recommender.api.openshift.io/api/v1/stack-analyses/e80bac1847b3499e9f7b929d6b927883';

    constructor() {}
    ngOnInit(): void {
        console.log('Inside ngInit');
    }
}
