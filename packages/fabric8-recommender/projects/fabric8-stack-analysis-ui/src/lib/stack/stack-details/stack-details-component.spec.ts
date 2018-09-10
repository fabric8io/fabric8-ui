import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StackDetailsComponent } from './stack-details.component';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-modal';
import { TabsModule, AccordionModule } from 'ngx-bootstrap';


/** New UX */
import { PipelineInsightsModule } from '../pipeline-insights/pipeline-insights.module';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService, AUTH_API_URL, SSO_API_URL } from 'ngx-login-client';

/** Stack Report Revamp - Latest */
import { ReportSummaryModule } from '../report-summary/report-summary.module';
import { CardDetailsModule } from '../card-details/card-details.module';
import { CommonService } from '../utils/common.service';
/** Stack Report Revamp - Latest */

import { StackAnalysesService } from '../stack-analyses.service';

const revampImports = [
  ReportSummaryModule,
  CardDetailsModule
];

describe ('StackDetailsComponent', () => {
    let component: StackDetailsComponent;
    let fixture: ComponentFixture<StackDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpClientModule,
                FormsModule,
                ModalModule,
                PipelineInsightsModule,
                AccordionModule.forRoot(),
                TabsModule.forRoot(),
                ...revampImports
            ],
            declarations: [
                StackDetailsComponent
            ],
            providers: [
                Broadcaster,
                // ApiLocatorService,
                // witApiUrlProvider,
                // authApiUrlProvider,
                // ssoApiUrlProvider,
                // realmProvider,
                {
                    provide: AuthenticationService, useValue: {}
                },
                Contexts,
                CommonService,
                StackAnalysesService
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
