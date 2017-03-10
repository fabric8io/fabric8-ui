/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { OverviewComponent } from './overview.component';
import { ChartComponent } from './chart-component';

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
            providers: []
        })
            .compileComponents();
    }));

    it('Component has to be present', () => {
        fixture = TestBed.createComponent(OverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

});
