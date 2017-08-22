import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {StackDetailsComponent} from './stack-details.component';

import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-modal';
import {TabsModule} from 'ng2-bootstrap';
import {AccordionModule} from 'ng2-bootstrap';

import { GlobalConstants } from '../constants/constants.service';

/** New UX */
import {StackLevelModule} from '../stack-level/stack-level.module';
import {ComponentLevelModule} from '../component-level/component-level.module';
import {FeedbackModule} from '../feedback/feedback.module';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService, AUTH_API_URL, SSO_API_URL } from 'ngx-login-client';

import { witApiUrlProvider } from '../../shared/wit-api.provider';
import { ApiLocatorService } from '../../shared/api-locator.service';
import { authApiUrlProvider } from '../../shared/auth-api.provider';
import { ssoApiUrlProvider } from '../../shared/sso-api.provider';
import { realmProvider } from '../../shared/realm-token.provider';
import { MockAuthenticationService } from '../../shared/mock-auth.service';

describe ('StackDetailsComponent', () => {
    let component: StackDetailsComponent;
    let fixture: ComponentFixture<StackDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpModule,
                FormsModule,
                ModalModule,
                StackLevelModule,
                ComponentLevelModule,
                FeedbackModule,
                AccordionModule.forRoot(),
                TabsModule.forRoot()
            ],
            declarations: [
                StackDetailsComponent
            ],
            providers: [
                Broadcaster,
                ApiLocatorService,
                witApiUrlProvider,
                authApiUrlProvider,
                ssoApiUrlProvider,
                realmProvider,
                {
                    provide: AuthenticationService, useClass: MockAuthenticationService
                },
                Contexts
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StackDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
