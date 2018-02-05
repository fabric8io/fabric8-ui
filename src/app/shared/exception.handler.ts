import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { UserService } from 'ngx-login-client';
import Raven from 'raven-js';

// TODO - replace with configuration variable
Raven.config('https://e71023d2bd794b708ea5a4f43e914b11@errortracking.prod-preview.openshift.io/8').install();

@Injectable()
export class RavenExceptionHandler implements ErrorHandler {
  constructor(private injector: Injector) {
  }

  handleError(err: any) {
    let userService = this.injector.get(UserService);
    if (userService.currentLoggedInUser && userService.currentLoggedInUser.attributes) {
      Raven.setUserContext({
        email: userService.currentLoggedInUser.attributes.email,
        id: userService.currentLoggedInUser.id
      });
    }
    Raven.captureException(err.originalException || err);
  }
}
