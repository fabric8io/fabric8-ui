import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions } from '@angular/http';


import { ReportSummaryDescriptionComponent } from './report-summary-description.component';

describe ('ReportSummaryDescriptionComponent', () => {
    let component: ReportSummaryDescriptionComponent;
    let fixture: ComponentFixture<ReportSummaryDescriptionComponent>;
    let element: HTMLDocument;
    const description = 'This is a test description';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ReportSummaryDescriptionComponent
            ],
            providers: [
                Http,
                ConnectionBackend,
                { provide: RequestOptions, useClass: BaseRequestOptions }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportSummaryDescriptionComponent);
        component = fixture.componentInstance;
        component.description = description;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have the description inside paragraph element', () => {
        const pElem: HTMLParagraphElement = element.querySelector('p');
        expect(pElem.innerText).toBe(description);
    });
});
