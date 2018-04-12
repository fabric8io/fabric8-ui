import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WorkItemBarchartConfig } from './work-item-barchart-config';
import { WorkItemBarchartData } from './work-item-barchart-data';
import { WorkItemBarchartComponent } from './work-item-barchart.component';

describe('WorkItemBarchartComponent', () => {
  let comp: WorkItemBarchartComponent;
  let fixture: ComponentFixture<WorkItemBarchartComponent>;

  let chartConfig: WorkItemBarchartConfig;
  let chartData: WorkItemBarchartData;

  beforeEach(() => {
    chartConfig  = {
      chartId: 'testChart',
      size: {
        height: 275,
        width: 130
      }
    };
    chartData = {
      colors: {},
      yData: [
        ['Open', 1],
        ['In Progress', 1],
        ['Resolved', 2]
      ],
      yGroups: ['Open', 'In Progress', 'Resolved']
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, FormsModule],
      declarations: [WorkItemBarchartComponent],
      providers: []
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(WorkItemBarchartComponent);
        comp = fixture.componentInstance;
        comp.config = chartConfig;
        comp.chartData = chartData;
        fixture.detectChanges();
      });
  }));

  it('should set chart id', () => {
    expect(comp.config.chartId).toContain('testChart');
  });

  it('should not show axis by default', () => {
    let elements = fixture.debugElement.queryAll(By.css('#testChart'));
    expect(elements.length).toBe(1);

    expect(comp.config.axis.x.show).toBe(false);
    expect(comp.config.axis.y.show).toBe(false);
  });

  it('should allow attribute specifications to show x and y axis', () => {
    chartConfig.showXAxis = true;
    chartConfig.showYAxis = true;

    fixture.detectChanges();

    expect(comp.config.axis.x.show).toBe(true);
    expect(comp.config.axis.y.show).toBe(true);
  });

  it('should update when the show x and y axis attributes change', () => {
    chartConfig.showXAxis = false;
    chartConfig.showYAxis = false;
    fixture.detectChanges();

    expect(comp.config.axis.x.show).toBe(false);
    expect(comp.config.axis.y.show).toBe(false);

    chartConfig.showXAxis = true;
    chartConfig.showYAxis = true;
    fixture.detectChanges();

    expect(comp.config.axis.x.show).toBe(true);
    expect(comp.config.axis.y.show).toBe(true);
  });

  it('should allow attribute specification of chart height', () => {
    chartConfig.chartHeight = 120;
    fixture.detectChanges();
    expect(comp.config.size.height).toBe(120);
  });

  it('should update when the chart height attribute changes', () => {
    chartConfig.chartHeight = 120;

    fixture.detectChanges();
    expect(comp.config.size.height).toBe(120);

    chartConfig.chartHeight = 100;
    fixture.detectChanges();
    expect(comp.config.size.height).toBe(100);
  });

  it('should setup C3 chart data correctly', () => {
    expect(comp.config.data.columns.length).toBe(3);
    expect(comp.config.data.columns[0][0]).toBe('Open');
    expect(comp.config.data.columns[1][0]).toBe('In Progress');
    expect(comp.config.data.columns[2][0]).toBe('Resolved');
  });

  it('should update C3 chart data when data changes', () => {
    expect(comp.config.data.columns.length).toBe(3);
    expect(comp.config.data.columns[0][1]).toBe(1);
    expect(comp.config.data.columns[1][1]).toBe(1);
    expect(comp.config.data.columns[2][1]).toBe(2);

    chartData.yData[1][1] = 1000;
    fixture.detectChanges();
    expect(comp.config.data.columns[1][1]).toBe(1000);
  });

  it('should allow using a tooltip function', () => {
    let tooltipCalled = false;
    let tooltip = {
      contents: (d: any) => {
        tooltipCalled = true;
      }
    };

    chartConfig.tooltip = tooltip;
    fixture.detectChanges();

    let dataPoint = [{ value: 0, name: 'used' }, 0];
    chartConfig.tooltip.contents(dataPoint); // TODO - c3 should invoke tooltip
    expect(tooltipCalled).toBe(true);
  });
});
