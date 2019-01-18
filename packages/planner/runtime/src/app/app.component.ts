import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from 'ngx-login-client';

import { GlobalSettings } from './shared/globals';

@Component({
  selector: 'f8-app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [GlobalSettings],
})
export class AppComponent implements OnInit {
  notifications: Object[] = [];

  notificationType: Object = {
    ok: 'alert-success',
    info: 'alert-info',
    warning: 'alert-warning',
    error: 'alert-danger',
  };

  notificationTypeIcon: Object = {
    ok: 'pficon-ok',
    info: 'pficon-info',
    warning: 'pficon-warning-triangle-o',
    error: 'pficon-error-circle-o',
  };

  constructor(
    auth: AuthenticationService,
    private globalSettings: GlobalSettings,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
  ) {
    //auth.isLoggedIn();
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.authService.onLogIn();
    } else {
      this.authService.logout();
    }

    this.activatedRoute.params.subscribe(() => {
      let query = window.location.search.substr(1);
      let result: any = {};
      query.split('&').forEach(function(part) {
        let item: any = part.split('=');
        result[item[0]] = decodeURIComponent(item[1]);
      });
      if (result['token_json']) {
        this.authService.logIn(result['token_json']);
      }
    });
  }
}
