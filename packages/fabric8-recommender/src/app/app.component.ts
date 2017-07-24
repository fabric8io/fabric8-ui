import { Component } from '@angular/core';

@Component({
    selector: 'f8-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    public stackUrl: string = 'https://recommender.api.openshift.io/api/v1/stack-analyses/2106725f66d04349b2f42fc185c04714';
    // public stackUrl: string = 'http://localhost:32000/api/v1/stack-analyses/ed6fc94dbe63454093c8586e5bb811dd';
}
