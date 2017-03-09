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
            dependencyChart: [
                ['internal', 11],
                ['external', 21]
            ],
            compUsageChart: [
                ['in teams', 2],
                ['in organizations', 3]
            ],
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

    it('setDependencyChartData have to be called', () => {
        let overviewComponent: any = new OverviewComponent();
        spyOn(overviewComponent, 'setDependencyChartData');
        overviewComponent.initOverviewComponents(stackOverviewData);
        expect(overviewComponent.setDependencyChartData).toHaveBeenCalled();
    });

    it('setCompUsageChartData have to be called', () => {
        let overviewComponent: any = new OverviewComponent();
        spyOn(overviewComponent, 'setCompUsageChartData');
        overviewComponent.initOverviewComponents(stackOverviewData);
        expect(overviewComponent.setCompUsageChartData).toHaveBeenCalled();
    });

    it('check if dependency data has been updated', () => {
        let overviewComponent: any = new OverviewComponent();
        overviewComponent.initOverviewComponents(stackOverviewData);
        expect(overviewComponent.dependenciesChart.data.type).toEqual('donut');
        expect(overviewComponent.dependenciesChart.chartOptions.donut.title)
            .toEqual('32 Dependencies');
    });

    it('check if component usage data has been updated', () => {
        let overviewComponent: any = new OverviewComponent();
        overviewComponent.initOverviewComponents(stackOverviewData);
        expect(overviewComponent.compUsageChart.data.type).toEqual('donut');
        expect(overviewComponent.compUsageChart.chartOptions.donut.title)
            .toEqual('Component usage');
    });

});
