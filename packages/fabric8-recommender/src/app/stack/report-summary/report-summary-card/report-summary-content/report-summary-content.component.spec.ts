import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions } from '@angular/http';

import { ReportSummaryInfoEntriesComponent } from './report-info-entries/report-info-entries.component';
import { ProgressMeterModule } from '../../../utils/progress-meter/progress-meter.module';

import { ReportSummaryContentComponent } from './report-summary-content.component';

describe ('ReportSummaryContentComponent', () => {
    let component: ReportSummaryContentComponent;
    let fixture: ComponentFixture<ReportSummaryContentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ReportSummaryInfoEntriesComponent,
                ReportSummaryContentComponent
            ],
            imports: [
                ProgressMeterModule
            ],
            providers: [
                Http,
                ConnectionBackend,
                { provide: RequestOptions, useClass: BaseRequestOptions }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportSummaryContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
