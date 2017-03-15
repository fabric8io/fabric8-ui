import { Spaces } from 'ngx-fabric8-wit';
/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AboutService } from './shared/about.service';
import { NotificationsService } from './shared/notifications.service';
import { LoginService } from './shared/login.service';


/*
 * App Component
 * Top Level Component
 */
@Component({
  host: {
    'class': 'app app-component flex-container in-column-direction flex-grow-1'
  },
  selector: 'f8-app',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent {


  constructor(
    private about: AboutService,
    private activatedRoute: ActivatedRoute,
    public notifications: NotificationsService,
    private loginService: LoginService,
    // Inject spaces, to ensure it starts listening
    private spaces: Spaces
  ) {

  }

  ngOnInit() {
    console.log('Welcome to Fabric8!');
    console.log('This is', this.about.buildVersion,
      '(Build', '#' + this.about.buildNumber, 'and was built on', this.about.buildTimestamp, ')');
    this.activatedRoute.params.subscribe(() => {
      this.loginService.login();
    });
  }

  handleAction($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

}
