/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { OverviewComponent } from './overview.component';
import { ChartComponent } from './chart-component';
import { StackAnalysesService } from '../stack-analyses.service';
import { AuthenticationService } from 'ngx-login-client';
import { Broadcaster } from 'ngx-base';
import { authApiUrlProvider } from '../../shared/auth-api.provider';
import { ApiLocatorService } from '../../shared/api-locator.service';
import { ssoApiUrlProvider } from '../../shared/sso-api.provider';
import { realmProvider } from '../../shared/realm-token.provider';
import { MockAuthenticationService } from '../../shared/mock-auth.service';

import { GlobalConstants } from '../constants/constants.service';

describe('StackOverviewComponent', () => {
    let component: OverviewComponent;
    let fixture: ComponentFixture<OverviewComponent>;
    let stackOverviewData: any;

    beforeEach(async(() => {
        stackOverviewData = {
            CVEdata: ['CVE-2014-0001', 'CVE-2014-12345', 'CVE-2013-78934']
        };

        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpModule
            ],
            declarations: [OverviewComponent, ChartComponent],
            providers: [
                GlobalConstants,
                StackAnalysesService,
                AuthenticationService,
                Broadcaster,
                authApiUrlProvider,
                ApiLocatorService,
                ssoApiUrlProvider,
                realmProvider,
                MockAuthenticationService
            ]
        })
            .compileComponents();
    }));

    it('Component has to be present', () => {
        fixture = TestBed.createComponent(OverviewComponent);
        component = fixture.componentInstance;
        component.overviewData = {
            summaryInfo: {}
        };
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

});
