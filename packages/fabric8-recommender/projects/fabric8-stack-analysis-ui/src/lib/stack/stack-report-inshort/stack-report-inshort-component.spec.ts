import {  async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsModule  } from 'ngx-bootstrap';
import { StackReportInShortComponent } from './stack-report-inshort.component';
import { ChartModule } from '../utils/chart/chart.module';
import { StackDetailsModule } from '../stack-details/stack-details.module';
import { StackAnalysesService } from '../stack-analyses.service';
import { AuthenticationService } from 'ngx-login-client';
import { MockAuthenticationService } from '../../shared/mock-auth.service';
import { ReportSummaryModule } from '../report-summary/report-summary.module';
import { CommonService } from '../utils/common.service';

describe ('StackReportInShortComponent', () => {
    let component: StackReportInShortComponent;
    let fixture: ComponentFixture<StackReportInShortComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ChartModule,
                StackDetailsModule,
                TabsModule.forRoot(),
                ReportSummaryModule
            ],
            providers: [
                StackAnalysesService,
                {
                    provide: AuthenticationService, useClass: MockAuthenticationService
                },
                CommonService
            ],
            declarations: [
                StackReportInShortComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StackReportInShortComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
