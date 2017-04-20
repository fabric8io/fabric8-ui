import { Component } from '@angular/core';

@Component({
    selector: 'f8-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    public stackUrl: string = 'https://recommender.api.prod-preview.openshift.io/api/v1/stack-analyses/4dee41bf900a4c05aa96c91bd7a064c3';
}
