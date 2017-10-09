import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
    selector: 'f8-app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
    public stackUrl: string = 'https://recommender.api.openshift.io/api/v1/stack-analyses/9f9a8e4c026c4f6590ed42149c97995d';

    constructor() {}
    ngOnInit(): void {
        console.log('Inside ngInit');
    }
}
