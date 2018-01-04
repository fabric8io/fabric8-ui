import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions } from '@angular/http';

import {
    MCardDetails
} from '../../../models/ui.model';

import { NoDataComponent } from './no-data.component';

const components = [
    NoDataComponent
];

describe ('NoDataComponent', () => {
    let component: NoDataComponent;
    let fixture: ComponentFixture<NoDataComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ...components
            ],
            providers: [
                Http,
                ConnectionBackend,
                { provide: RequestOptions, useClass: BaseRequestOptions }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NoDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
