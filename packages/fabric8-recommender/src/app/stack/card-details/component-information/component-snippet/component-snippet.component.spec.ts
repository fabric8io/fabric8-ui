import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions } from '@angular/http';

import { ReportSummaryCardModule } from './report-summary-card/report-summary-card.module';
import { ReportSummaryComponent } from './report-summary.component';

describe ('ReportSummaryComponent', () => {
    let component: ReportSummaryComponent;
    let fixture: ComponentFixture<ReportSummaryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ReportSummaryCardModule
            ],
            declarations: [
                ReportSummaryComponent
            ],
            providers: [
                Http,
                ConnectionBackend,
                { provide: RequestOptions, useClass: BaseRequestOptions }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
