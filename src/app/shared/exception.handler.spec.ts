import { TestBed } from '@angular/core/testing';
import { UserService } from 'ngx-login-client';
import Raven from 'raven-js';

import { Environment } from './environment';
import * as environment from './environment';
import { RavenExceptionHandler } from './exception.handler';

describe('Raven exception handler', () => {
  const testId = 'test-id';
  const testEmail = 'email@email.com';

  let handler: RavenExceptionHandler;
  let captureExceptionSpy: jasmine.Spy;
  let getEnvironmentSpy: jasmine.Spy;

  beforeEach(() => {
    captureExceptionSpy = spyOn(Raven, 'captureException');

    // default environment to Environment.production
    getEnvironmentSpy = spyOn(environment, 'getEnvironment').and.callThrough();

    // init TestBed
    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: {
          currentLoggedInUser: {
            id: testId,
            attributes: {
              email: testEmail
            }
          }
        } },
        RavenExceptionHandler
      ]
    });

    handler = TestBed.get(RavenExceptionHandler);
  });

  it('Environment.development does not invoke Raven', () => {
    getEnvironmentSpy.and.returnValue(Environment.development);
    handler.handleError('testing Environment.development');
    expect(captureExceptionSpy).not.toHaveBeenCalled();
  });

  it('Environment.prDeploy does not invoke Raven', () => {
    getEnvironmentSpy.and.returnValue(Environment.prDeploy);
    handler.handleError('testing Environment.prDeploy');
    expect(captureExceptionSpy).not.toHaveBeenCalled();
  });

  it('Environment.production does invoke Raven', () => {
    getEnvironmentSpy.and.returnValue(Environment.production);
    handler.handleError('testing Environment.production');
    expect(captureExceptionSpy).toHaveBeenCalled();
  });

  it('Environment.prodPreview does invoke Raven', () => {
    getEnvironmentSpy.and.returnValue(Environment.prodPreview);
    handler.handleError('testing Environment.prodPreview');
    expect(captureExceptionSpy).toHaveBeenCalled();
  });

  describe('raven error handling', () => {

    beforeEach(() => {
      // default environment to Environment.production
      getEnvironmentSpy.and.returnValue(Environment.production);
    });

    it('setUserContext from UserService.currentLoggedInUser', () => {
      const setUserContextSpy = spyOn(Raven, 'setUserContext');
      handler.handleError('');
      expect(setUserContextSpy.calls.first().args[0]).toEqual({
        id: testId,
        email: testEmail
      });
    });

    it('string error generates no fingerprint', () => {
      const err = 'test error';
      handler.handleError(err);
      expect(captureExceptionSpy.calls.first().args[0]).toBe(err);
      expect(captureExceptionSpy.calls.first().args.length).toBe(1);
    });

    it('Error with message generates custom fingerprint', () => {
      const errMessage = 'test error';
      const err = new Error(errMessage);
      delete err.stack;
      handler.handleError(err);
      expect(captureExceptionSpy.calls.first().args[0]).toBe(err);
      expect(captureExceptionSpy.calls.first().args[1]).toEqual({
        fingerprint: [errMessage]
      });
    });

    it('Error with stack and message generates custom fingerprint', () => {
      const errMessage = 'test error';
      const stack = ['Error: msg', 'first frame', 'second frame'];
      const err = new Error(errMessage);
      err.stack = stack.join('\n');
      handler.handleError(err);
      expect(captureExceptionSpy.calls.first().args[0]).toBe(err);
      expect(captureExceptionSpy.calls.first().args[1]).toEqual({
        fingerprint: [errMessage].concat(stack.slice(0, 2))
      });
    });
  });
});
