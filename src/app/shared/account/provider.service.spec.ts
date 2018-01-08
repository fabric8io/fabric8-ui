import { inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { Broadcaster, Logger } from 'ngx-base';
import { AUTH_API_URL, AuthenticationService } from 'ngx-login-client';
import { ProviderService } from './provider.service';

describe('Service: Provider Service', () => {

    let mockService: MockBackend;
    let providerService: ProviderService;
    let broadcaster: Broadcaster;
    let fakeAuthService: any;

    beforeEach(() => {
        fakeAuthService = {
            getToken: function() {
              return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiY2xpZW50X3Nlc3Npb24iOiJURVNUU0VTU0lPTiIsInNlc3Npb25fc3RhdGUiOiJURVNUU0VTU0lPTlNUQVRFIiwiYWRtaW4iOnRydWUsImp0aSI6ImY5NWQyNmZlLWFkYzgtNDc0YS05MTk0LWRjM2E0YWFiYzUwMiIsImlhdCI6MTUxMDU3MTMxOSwiZXhwIjoxNTEwNTgwODI3fQ.l0m6EFvk5jbND3VOXL3gTkzTz0lYQtPtXS_6C24kPQk';
            },
            isLoggedIn: function() {
              return true;
            }
          };

        TestBed.configureTestingModule({
          providers: [
            BaseRequestOptions,
            ProviderService,
            MockBackend,
            {
              provide: Http,
              useFactory: (backend: MockBackend,
                           options: BaseRequestOptions) => new Http(backend, options),
              deps: [MockBackend, BaseRequestOptions]
            },
            {
              provide: AUTH_API_URL,
              useValue: 'https://auth.fabric8.io/api/'
            },
            {
                provide: AuthenticationService,
                useValue: fakeAuthService
            },
            Broadcaster,
            Logger
          ]
        });
      });


    beforeEach(inject(
        [ProviderService, MockBackend, Broadcaster],
        (service: ProviderService, mock: MockBackend, broadcast: Broadcaster) => {
            providerService = service;
            mockService = mock;
            broadcaster = broadcast;
        }
    ));
    it('Get legacy linking url', () => {
        let val = providerService.getLegacyLinkingUrl('openshift-v3', 'testredirect');
        console.log(val);
        expect(val).toEqual('https://auth.fabric8.io/api/link/session?clientSession=TESTSESSION&sessionState=TESTSESSIONSTATE&redirect=testredirect&provider=openshift-v3');
    });
});
