import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
    selector: 'f8-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
    public stackUrl: string; //'http://bayesian-api-bayesian-preview.b6ff.rh-idev.openshiftapps.com/api/v1/stack-analyses-v2/132389240e2342409dda9b8c800a905d';
    // public stackUrl: string = 'http://localhost:32000/api/v1/stack-analyses/ed6fc94dbe63454093c8586e5bb811dd';

    constructor(private route: ActivatedRoute) {
        this.route.paramMap.subscribe((params) => {
            this.label = params.get('id');
        });
        window.onhashchange = () => {
            let id: string = location.hash.replace('#/analyze/', '');
            this.label = id;
            this.changeLabel();
        };
    }

    public label: string;
    public routerLink: string;
    // d6819b27a4ba4e8fa6f6bf63bb7764ee;
    changeLabel() {
        console.log(this.label);
        if (this.label && this.label.trim() !== '') {
            this.routerLink = '/analyze/' + this.label;
            this.stackUrl = 'https://recommender.api.openshift.io/api/v1/stack-analyses-v2/' + this.label;
        }
    }

    ngOnInit(): void {
        console.log('Inside ngInit');
        this.changeLabel();
    }


}
