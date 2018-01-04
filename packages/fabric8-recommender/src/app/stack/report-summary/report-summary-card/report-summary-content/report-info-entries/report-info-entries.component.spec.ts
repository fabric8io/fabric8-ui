import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions } from '@angular/http';

import { MReportSummaryInfoEntry } from '../../../../models/ui.model';
import { ReportSummaryInfoEntriesComponent } from './report-info-entries.component';
import { ProgressMeterModule } from '../../../../utils/progress-meter/progress-meter.module';

describe ('ReportSummaryInfoEntriesComponent', () => {
    let component: ReportSummaryInfoEntriesComponent;
    let fixture: ComponentFixture<ReportSummaryInfoEntriesComponent>;
    let element: HTMLElement;
    let entry: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
    entry.infoText = 'info text1';
    entry.infoValue = 'info value';
    entry.infoType = 'text';
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ProgressMeterModule
            ],
            declarations: [
                ReportSummaryInfoEntriesComponent
            ],
            providers: [
                Http,
                ConnectionBackend,
                { provide: RequestOptions, useClass: BaseRequestOptions }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportSummaryInfoEntriesComponent);
        component = fixture.componentInstance;
        component.entry = entry;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('check if the input received is of the type MReportSummaryInfoEntry', () => {
        expect(component.entry instanceof MReportSummaryInfoEntry).toBeTruthy();
    });

    it('should have the class "ana-normal" if the infoType is "text"', () => {
        let parent = element.querySelector('.ana-summary-info');
        expect(parent.children[0].classList.contains('ana-normal')).toBeTruthy();
    });

    it('should have the class "ana-custom" if the infoType is "progress"', () => {
        let entry: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
        entry.infoText = 'info text1';
        entry.infoValue = 'info value';
        entry.infoType = 'progress';
        component.entry = entry;
        fixture.detectChanges();
        let parent = element.querySelector('.ana-summary-info');
        expect(parent.children[0].classList.contains('ana-custom')).toBeTruthy();
    });
});
