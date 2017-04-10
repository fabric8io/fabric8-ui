import { Component } from '@angular/core';

@Component({
    selector: 'f8-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    public stackUrl: string = 'https://recommender.api.prod-preview.openshift.io/api/v1/stack-analyses/ff59ea91cf264003bc6dc12621c91205';
}
