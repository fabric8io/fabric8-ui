import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { UserService } from 'ngx-login-client';
import Raven from 'raven-js';

const currentUrl = window.location.href;
let environment = 'production';
if (currentUrl.indexOf('prod-preview') > -1) {
  environment = 'prod-preview';
} else if (currentUrl.indexOf('localhost') > -1) {
  environment = 'development';
} else if (currentUrl.indexOf('badger') > -1) {
  environment = 'prDeploy';
}

// TODO - replace with configuration variable
Raven.config('https://e71023d2bd794b708ea5a4f43e914b11@errortracking.prod-preview.openshift.io/8',
{
  environment: environment
}).install();

@Injectable()
export class RavenExceptionHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  handleError(err: any) {
    let userService = this.injector.get(UserService);
    if (userService.currentLoggedInUser && userService.currentLoggedInUser.attributes) {
      Raven.setUserContext({
        email: userService.currentLoggedInUser.attributes.email,
        id: userService.currentLoggedInUser.id
      });
    }
    if (environment === 'prod-preview' || environment === 'production') {
      Raven.captureException(err.originalException || err);
    } else {
      super.handleError(err);
    }
  }
}
