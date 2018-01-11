import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions } from '@angular/http';
import { TabsModule } from 'ngx-bootstrap';

import { CardDetailsComponent } from './card-details.component';
import { ReportInformationModule } from './report-information/report-information.module';

const imports = [
    TabsModule,
    ReportInformationModule
];

describe ('CardDetailsComponent', () => {
    let component: CardDetailsComponent;
    let fixture: ComponentFixture<CardDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ...imports
            ],
            declarations: [
                CardDetailsComponent
            ],
            providers: [
                Http,
                ConnectionBackend,
                { provide: RequestOptions, useClass: BaseRequestOptions }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
