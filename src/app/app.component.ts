/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';

import { AboutService } from './shared/about.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  host:{
    'class':'app app-component flex-container in-column-direction flex-grow-1'
  },
  selector: 'f8-app',
  styleUrls: [ './app.component.scss' ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';

  constructor(private about: AboutService) {

  }

  ngOnInit() {
    console.log('Welcome to Fabric8!');
    console.log('This build is', '#' + this.about.buildNumber, 'and was built on', this.about.buildTimestamp);
  }

}
