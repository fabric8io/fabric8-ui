import { ConnectedAccountsComponent } from './connected-accounts.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Fabric8UIConfig } from '../shared/config/fabric8-ui-config';

import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { AuthenticationService } from 'ngx-login-client';
import { Contexts } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Observable';

describe('Connected Accounts Component', () => {

  const expectedOsoUser: string = 'oso-test-user';
  const ctx: any = {
    user: {
      attributes: {
        username: expectedOsoUser
      }
    }
  };

  let fixture: ComponentFixture<ConnectedAccountsComponent>;
  let el: HTMLElement;

  let contextsMock: any;
  let authMock: any;

  beforeEach(async(() => {
    contextsMock = jasmine.createSpy('Contexts');
    authMock = jasmine.createSpy('AuthenticationService');

    TestBed.configureTestingModule({
      declarations: [ConnectedAccountsComponent],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authMock
        },
        {
          provide: Contexts,
          useValue: contextsMock
        },
        {
          provide: ComponentFixtureAutoDetect,
          useValue: true
        }
      ]
    }).compileComponents();
  }));

  afterEach(() => {
    fixture.destroy();
  });

  describe('User has only GitHub account connected', () => {

    beforeEach(() => {
      authMock.gitHubToken = Observable.of('gh-test-user');
      authMock.openShiftToken = Observable.empty();
      contextsMock.current = Observable.empty();

      fixture = TestBed.createComponent(ConnectedAccountsComponent);
      el = fixture.debugElement.nativeElement;
    });

    it('should have GitHub connection indicated', () => {
      let actualText = trimCarriageReturns(el);
      expect(actualText).toContain('GitHub Connected');
    });

    it('should have absence of OpenShift connection indicated', () => {
      let actualText = trimCarriageReturns(el);
      expect(actualText).toContain('OpenShift Not Connected');
    });

  });

  describe('User has only OpenShift account connected', () => {

    beforeEach(() => {
      authMock.gitHubToken = Observable.empty();
      authMock.openShiftToken = Observable.of('oso-token');
      contextsMock.current = Observable.of(ctx);

      fixture = TestBed.createComponent(ConnectedAccountsComponent);
      el = fixture.debugElement.nativeElement;
    });

    it('should have absence of GitHub connection indicated', () => {
      let actualText = trimCarriageReturns(el);
      expect(actualText).toContain('GitHub Not Connected');
    });

    it('should have OpenShift connection indicated', () => {
      let actualText = trimCarriageReturns(el);
      expect(actualText).toContain('OpenShift ' + expectedOsoUser);
    });

  });

  describe('User has both Github and OpenShift accounts connected', () => {

    beforeEach(() => {
      authMock.gitHubToken = Observable.of('gh-test-user');
      authMock.openShiftToken = Observable.of('oso-token');
      contextsMock.current = Observable.of(ctx);

      fixture = TestBed.createComponent(ConnectedAccountsComponent);
      el = fixture.debugElement.nativeElement;
    });

    it('should have GitHub connection indicated', () => {
      let actualText = trimCarriageReturns(el);
      expect(actualText).toContain('GitHub Connected');
    });

    it('should have OpenShift connection indicated', () => {
      let actualText = trimCarriageReturns(el);
      expect(actualText).toContain('OpenShift ' + expectedOsoUser);
    });

  });

});

function trimCarriageReturns(el: HTMLElement) {
  return el.innerText.replace(/[\n\r]+/g, ' ');
}
