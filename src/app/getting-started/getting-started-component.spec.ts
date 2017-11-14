import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
import { Router , RouterModule} from '@angular/router';
import { GettingStartedComponent } from './getting-started.component';
import { FormsModule } from '@angular/forms';
import { AuthenticationService, UserService, User,AUTH_API_URL } from 'ngx-login-client';
import { Fabric8UIConfig } from "../shared/config/fabric8-ui-config";
import { ExtUser, GettingStartedService } from './services/getting-started.service';
import { Logger, Notification, NotificationType, Notifications } from 'ngx-base';
import { ProviderService } from './services/provider.service';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {loggedInUser, profile } from './../shared/context.service.mock'

import { Observable,ConnectableObservable } from 'rxjs';

describe('GettingStartedComponent',() => {
    let gettingStartedComponent: GettingStartedComponent;
    let fixture: ComponentFixture<GettingStartedComponent>;
    let el = HTMLElement;
    let fakeAuthService : any; 
    let mockService: MockBackend;    
    let fakeGettingStartedService: any;
    let fakeFabric8UIConfig: any;
    let fakeProviderService: any;
    let fakeUserService: any;
    
    beforeEach(() => {
        let mockRouter = jasmine.createSpy('Router');

        fakeAuthService = {
            getToken: function () {
              return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiY2xpZW50X3Nlc3Npb24iOiJURVNUU0VTU0lPTiIsInNlc3Npb25fc3RhdGUiOiJURVNUU0VTU0lPTlNUQVRFIiwiYWRtaW4iOnRydWUsImp0aSI6ImY5NWQyNmZlLWFkYzgtNDc0YS05MTk0LWRjM2E0YWFiYzUwMiIsImlhdCI6MTUxMDU3MTMxOSwiZXhwIjoxNTEwNTgwODI3fQ.l0m6EFvk5jbND3VOXL3gTkzTz0lYQtPtXS_6C24kPQk';
            },
            isLoggedIn: function () {
              return true;
            }, 
            githubToken : Observable.of("ghtoken"),
            openShiftToken : Observable.of("openshifttoken")
        };
        fakeFabric8UIConfig = {
            kubernetesMode : "false",
            tenantApiUrl:"https://api.tenant.openshift.com/",
            witApiUrl:"https://wit.fabric8.io/api/"
        }
        fakeGettingStartedService = jasmine.createSpyObj('GettingStartedService', ['createTransientProfile', 'update']);
        fakeUserService = jasmine.createSpyObj('UserService', ['getUserByUserId']);
        fakeUserService.loggedInUser = Observable.of(loggedInUser);
        
        fakeProviderService  ={
            getLegacyLinkingUrl: function(p: string, r: string){
                return p+r;
            },
            linkOpenShift: function(r: string){
            
            }
        };
   

        TestBed.configureTestingModule({
            declarations: [ GettingStartedComponent ], // declare the test component
            
            imports: [ FormsModule ],            
            providers:[
                 BaseRequestOptions,
                 MockBackend,
                 Notifications,
                 Logger,
                 {
                  provide: Http,
                  useFactory: (backend: MockBackend,
                               options: BaseRequestOptions) => new Http(backend, options),
                  deps: [MockBackend, BaseRequestOptions]
                 },
                 {
                     provide: Router,
                     useClass:  mockRouter

                 },
                 {
                    provide: WIT_API_URL,
                    useValue: "https://wit.fabric8.io/api/"
                 },
                 {
                    provide: AUTH_API_URL,
                    useValue: "https://auth.fabric8.io/api/"
                  },
                  {
                      provide: AuthenticationService,
                      useValue: fakeAuthService
                  },
                  {
                      provide: GettingStartedService,
                      useValue: fakeGettingStartedService
                  },
                  {
                      provide: Fabric8UIConfig,
                      useValue: fakeFabric8UIConfig
                  },
                  {
                      provide: ProviderService,
                      useValue: fakeProviderService,    
                  },
                  {
                      provide:UserService,
                      useValue:fakeUserService
                  },
            ],
              // Tells the compiler not to error on unknown elements and attributes
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(GettingStartedComponent);
        gettingStartedComponent = fixture.componentInstance;                    
    });

    it('if github is already linked, then no need to link again ', () => {

        gettingStartedComponent.gitHubLinked = true;
        fixture.detectChanges();        
        expect(gettingStartedComponent.authGitHub).toEqual(false);        

    });

    it('if BOTH github & oso is being linked, then link OSO as a redirect',() => {

        gettingStartedComponent.authOpenShift = true;
        gettingStartedComponent.openShiftLinked = false; 
        gettingStartedComponent.authGitHub = true ;
        gettingStartedComponent.gitHubLinked = false;

        fixture.detectChanges();

        let r = gettingStartedComponent.connectAccounts();

        // Check that form submission is allowed.
        expect(r).toEqual(true);

        // TODO: Fix me . Not critical. This doesnt use the mockProviderService somehow - but it should use.
        expect(gettingStartedComponent.redirect).toEqual('https://auth.fabric8.io/api/link/session?clientSession=TESTSESSION&sessionState=TESTSESSIONSTATE&redirect='+window.location.origin+'/_gettingstarted?wait=true&provider=openshift-v3');
        console.log(gettingStartedComponent.redirect);

    });

    it('Confirm that the form submission url is generated properly',() => {
        expect(gettingStartedComponent.linkingApiURL).toEqual('https://auth.fabric8.io/api/token/link');
    });



    /* this causes page reload.

    it('if only github is not being linked, then redirect to link OSO',() => {
            
        gettingStartedComponent.authGitHub = false;
        fixture.detectChanges();
        expect(gettingStartedComponent.connectAccounts()).toEqual(false);
    });
    */

    it('if only github is being linked, then use form submission',() => {

        gettingStartedComponent.gitHubLinked = false;
        gettingStartedComponent.openShiftLinked = false;
        gettingStartedComponent.authGitHub = true;
        gettingStartedComponent.authOpenShift = true;
        fixture.detectChanges();

        // true allows form submission ( where false blocks it )
        expect(gettingStartedComponent.connectAccounts()).toEqual(true);

    });

    it('if both accounts are already linked, then disable ConnectAccounts button',() => {
        // FIXME : Add test
        expect(true).toEqual(true);        
    });
       
    it('if both the disconnected Github & OpenShift accounts are not selected for linking, disable ConnectAccounts button',() => {
        // FIXME : Add test
        expect(true).toEqual(true);
    });
    it('if Github account is selected for linking, enable ConnectAccounts button',() => {
        // FIXME : Add test
        expect(true).toEqual(true);
    });
    it('if OpenShift account is selected for linking, enable ConnectAccounts button',() => {
        // FIXME : Add test
        expect(true).toEqual(true);
    });
    it('if Github & OpenShift account is selected for linking, enable ConnectAccounts button',() => {
        // FIXME : Add test
        expect(true).toEqual(true);
    });
});