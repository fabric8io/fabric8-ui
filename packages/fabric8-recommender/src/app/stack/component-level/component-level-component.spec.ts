import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Http, ConnectionBackend, RequestOptions, BaseRequestOptions} from '@angular/http';
import {Contexts} from 'ngx-fabric8-wit';
import {TooltipModule} from 'ngx-bootstrap';
import {ToastNotificationComponent} from '../toast-notification/toast-notification.component';
import {ComponentLevelComponent} from './component-level.component';
import {EllipsisDirective} from '../utils/ellipsis.directive';
import {TableFilter} from '../utils/table-filter.pipe';
import {AddWorkFlowService} from '../stack-details/add-work-flow.service';
import {witApiUrlProvider} from '../../shared/wit-api.provider';
import { Broadcaster } from 'ngx-base';
import { AuthenticationService, AUTH_API_URL, SSO_API_URL } from 'ngx-login-client';
import { ApiLocatorService } from '../../shared/api-locator.service';
import { authApiUrlProvider } from '../../shared/auth-api.provider';
import { ssoApiUrlProvider } from '../../shared/sso-api.provider';
import { realmProvider } from '../../shared/realm-token.provider';
import { MockAuthenticationService } from '../../shared/mock-auth.service';

describe ('ComponentLevelComponent', () => {
    let component: ComponentLevelComponent;
    let fixture: ComponentFixture<ComponentLevelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TooltipModule
            ],
            declarations: [
                ComponentLevelComponent,
                EllipsisDirective,
                ToastNotificationComponent,
                TableFilter
            ],
            providers: [
                Http,
                Broadcaster,
                ApiLocatorService,
                witApiUrlProvider,
                authApiUrlProvider,
                ssoApiUrlProvider,
                realmProvider,
                {
                    provide: AuthenticationService, useClass: MockAuthenticationService
                },
                ConnectionBackend,
                AddWorkFlowService,
                { provide: RequestOptions, useClass: BaseRequestOptions },
                Contexts
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComponentLevelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
