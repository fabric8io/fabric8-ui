import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions } from '@angular/http';

import { AuthenticationService, AUTH_API_URL, SSO_API_URL } from 'ngx-login-client';
import { MockAuthenticationService } from '../../../shared/mock-auth.service';

import { ComponentFeedbackComponent } from './component-feedback.component';
import { ToastNotificationModule } from '../../toast-notification/toast-notification.module';

describe ('ComponentFeedbackComponent', () => {
    let component: ComponentFeedbackComponent;
    let fixture: ComponentFixture<ComponentFeedbackComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ToastNotificationModule
            ],
            declarations: [
                ComponentFeedbackComponent
            ],
            providers: [
                Http,
                ConnectionBackend,
                { provide: RequestOptions, useClass: BaseRequestOptions },
                {
                    provide: AuthenticationService, useClass: MockAuthenticationService
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComponentFeedbackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
