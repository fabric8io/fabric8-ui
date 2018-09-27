import { TestBed } from '@angular/core/testing';
import { UserService } from 'ngx-login-client';
import * as Raven from 'raven-js';
import { Environment } from './environment';
import * as environment from './environment';
import { RavenExceptionHandler } from './exception.handler';

describe('Raven exception handler', () => {
  const testId = 'test-id';
  const testEmail = 'email@email.com';

  let handler: RavenExceptionHandler;
  let captureExceptionSpy: jest.SpyInstance;
  let getEnvironmentSpy: jest.SpyInstance;

  beforeEach(() => {
    captureExceptionSpy = jest.spyOn(Raven, 'captureException');

    // default environment to Environment.production
    getEnvironmentSpy = jest.spyOn(environment, 'getEnvironment');

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
    spyOn(console, 'error').and.callFake(() => {});
    getEnvironmentSpy.mockReturnValue(Environment.development);
    handler.handleError('testing Environment.development (not a real error)');
    expect(captureExceptionSpy).not.toHaveBeenCalled();
  });

  it('Environment.prDeploy does not invoke Raven', () => {
    spyOn(console, 'error').and.callFake(() => {});
    getEnvironmentSpy.mockReturnValue(Environment.prDeploy);
    handler.handleError('testing Environment.prDeploy (not a real error)');
    expect(captureExceptionSpy).not.toHaveBeenCalled();
  });

  it('Environment.production does invoke Raven', () => {
    spyOn(console, 'error').and.callFake(() => {});
    getEnvironmentSpy.mockReturnValue(Environment.production);
    handler.handleError('testing Environment.production (not a real error)');
    expect(captureExceptionSpy).toHaveBeenCalled();
  });

  it('Environment.prodPreview does invoke Raven', () => {
    getEnvironmentSpy.mockReturnValue(Environment.prodPreview);
    handler.handleError('testing Environment.prodPreview');
    expect(captureExceptionSpy).toHaveBeenCalled();
  });

  describe('raven error handling', () => {

    beforeEach(() => {
      // default environment to Environment.production
      getEnvironmentSpy.mockReturnValue(Environment.production);
    });

    it('setUserContext from UserService.currentLoggedInUser', () => {
      const setUserContextSpy = spyOn(Raven, 'setUserContext');
      handler.handleError('');
      expect(setUserContextSpy).toHaveBeenCalledWith({
        id: testId,
        email: testEmail
      });
    });

    it('string error generates no fingerprint', () => {
      const err = 'test error';
      handler.handleError(err);
      expect(captureExceptionSpy).toHaveBeenCalledWith(err);
    });

    it('Error with message generates custom fingerprint', () => {
      const errMessage = 'test error';
      const err = new Error(errMessage);
      delete err.stack;
      handler.handleError(err);
      expect(captureExceptionSpy).toHaveBeenCalledWith(err, {
        fingerprint: [errMessage]
      });
    });

    it('Error with stack and message generates custom fingerprint', () => {
      const errMessage = 'test error';
      const stack = ['Error: msg', 'first frame', 'second frame'];
      const err = new Error(errMessage);
      err.stack = stack.join('\n');
      handler.handleError(err);
      expect(captureExceptionSpy).toHaveBeenCalledWith(err, {
        fingerprint: [errMessage].concat(stack.slice(0, 2))
      });
    });
  });
});
