import { Component } from '@angular/core';

@Component({
    selector: 'f8-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    public codebases: Array<any> = [
        {
        name: 'Pllm',
        uuid: '8950acb76bc84235873d73d149cb9f61',
        },
    ];
}
