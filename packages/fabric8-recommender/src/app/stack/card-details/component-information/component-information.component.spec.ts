import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions } from '@angular/http';

import { ComponentInformationComponent } from './component-information.component';
import { AddWorkFlowService } from '../../stack-details/add-work-flow.service';

import { TooltipModule } from 'ngx-bootstrap';
import { ToastNotificationComponent } from '../../toast-notification/toast-notification.component';
import { ComponentSnippetComponent } from './component-snippet/component-snippet.component';

import { ProgressMeterModule } from '../../utils/progress-meter/progress-meter.module';
import { ComponentFeedbackModule } from '../../utils/component-feedback/component-feedback.module';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService, AUTH_API_URL, SSO_API_URL } from 'ngx-login-client';

import { witApiUrlProvider } from '../../../shared/wit-api.provider';
import { ApiLocatorService } from '../../../shared/api-locator.service';
import { authApiUrlProvider } from '../../../shared/auth-api.provider';
import { ssoApiUrlProvider } from '../../../shared/sso-api.provider';
import { realmProvider } from '../../../shared/realm-token.provider';
import { MockAuthenticationService } from '../../../shared/mock-auth.service';

describe ('ComponentInformationComponent', () => {
    let component: ComponentInformationComponent;
    let fixture: ComponentFixture<ComponentInformationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TooltipModule,
                ProgressMeterModule,
                ComponentFeedbackModule,
                ComponentFeedbackModule
            ],
            declarations: [
                ToastNotificationComponent,
                ComponentInformationComponent,
                ComponentSnippetComponent
            ],
            providers: [
                Http,
                Contexts,
                AddWorkFlowService,
                ConnectionBackend,
                { provide: RequestOptions, useClass: BaseRequestOptions },
                witApiUrlProvider,
                ApiLocatorService,
                authApiUrlProvider,
                ssoApiUrlProvider,
                realmProvider,
                {
                    provide: AuthenticationService, useClass: MockAuthenticationService
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComponentInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
