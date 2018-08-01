import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { UserService } from 'ngx-login-client';
import Raven from 'raven-js';
import { Environment, getEnvironment } from './environment';

@Injectable()
export class RavenExceptionHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
    if (ENV !== 'test') {
      // TODO - replace with configuration variable
      Raven.config('https://e71023d2bd794b708ea5a4f43e914b11@errortracking.prod-preview.openshift.io/8',
      {
        environment: getEnvironment()
      }).install();
    }
  }

  handleError(err: any) {
    switch (getEnvironment()) {
      case Environment.production:
      case Environment.prodPreview:
        this.ravenHandleError(err);
        break;
      default:
        super.handleError(err);
    }
  }

  private ravenHandleError(err: any): void {
    const userService = this.injector.get(UserService);
    if (userService && userService.currentLoggedInUser && userService.currentLoggedInUser.attributes) {
      Raven.setUserContext({
        email: userService.currentLoggedInUser.attributes.email,
        id: userService.currentLoggedInUser.id
      });
    }
    const ex = err.originalException || err;
    const fingerprint = this.createFingerprint(ex);
    if (fingerprint && fingerprint.length > 0) {
      Raven.captureException(ex, {fingerprint});
    } else {
      Raven.captureException(ex);
    }
  }

  private createFingerprint(ex: any): null | string[] {
    let fingerprint;
    if (typeof ex === 'object') {
      fingerprint = [];

      if (typeof ex.message === 'string') {
        fingerprint.push(ex.message);
      }

      // If there is a stack trace, capture only the first frame.
      // For grouping purposes, we care about where the error occurred more than how we got there.
      // Example stack trace in Chrome:
      //
      // Error: TypeError object is undefined
      //   at MyComponent.function(file.js:100:10)
      //   at ...
      //
      if (typeof ex.stack === 'string') {
        const [msg, trace] = ex.stack.split('\n');
        if (msg) {
          fingerprint.push(msg);
        }
        if (trace) {
          fingerprint.push(trace);
        }
      }
    }
    return fingerprint;
  }
}
