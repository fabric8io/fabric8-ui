import {
  Component,
  DoCheck,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  ChartBase
} from 'patternfly-ng/chart';

import {
  cloneDeep,
  defaultsDeep,
  isEqual,
  merge,
  uniqueId
} from 'lodash';

import { WorkItemBarchartConfig } from './work-item-barchart-config';
import { WorkItemBarchartData } from './work-item-barchart-data';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-work-item-barchart',
  templateUrl: './work-item-barchart.component.html',
  styleUrls: ['./work-item-barchart.component.less']
})
export class WorkItemBarchartComponent extends ChartBase implements DoCheck, OnInit {
  @Input() chartData: WorkItemBarchartData;
  @Input() config: WorkItemBarchartConfig;

  private defaultConfig: WorkItemBarchartConfig;
  private prevChartData: WorkItemBarchartData;
  private prevConfig: WorkItemBarchartConfig;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.setupConfigDefaults();
    this.setupConfig();
    this.generateChart(this.config, true);
  }

  ngDoCheck(): void {
    if (!isEqual(this.config, this.prevConfig) || !isEqual(this.chartData, this.prevChartData)) {
      const dataChanged = isEqual(this.chartData, this.prevChartData);
      this.setupConfig();
      this.generateChart(this.config, dataChanged);
    }
  }

  protected setupConfig(): void {
    if (this.config !== undefined) {
      defaultsDeep(this.config, this.defaultConfig);
    } else {
      this.config = cloneDeep(this.defaultConfig);
    }
    if (this.config.axis !== undefined) {
      this.config.axis.x.show = this.config.showXAxis === true;
      this.config.axis.y.show = this.config.showYAxis === true;
    }
    if (this.config.chartHeight !== undefined) {
      this.config.size.height = this.config.chartHeight;
    }
    this.config.data = merge(this.config.data, this.getChartData());
    this.prevConfig = cloneDeep(this.config);
    this.prevChartData = cloneDeep(this.chartData);
  }

  protected setupConfigDefaults(): void {
    this.defaultConfig = {
      axis: {
        x: { show: true },
        y: { show: true }
      },
      grid: {
        x: { show: false },
        y: { show: false }
      }
    };
    this.defaultConfig.chartId = uniqueId(this.config.chartId);
    this.defaultConfig.grid.y.show = false;
    this.defaultConfig.legend = { show: false };
    this.defaultConfig.data = {
      type: 'bar',
      order: function(data1, data2) {
        return 1;
      }
    };
    this.defaultConfig.tooltip = this.tooltip();
    this.defaultConfig.units = '';
  }

  protected getChartData(): any {
    let data: any = {};

    if (this.chartData && this.chartData.dataAvailable !== false && this.chartData.yData) {
      data.colors = this.chartData.colors;
      if (this.chartData.yData !== undefined) {
        data.columns = [
          ...this.chartData.yData
        ];
      }
      if (this.chartData.yGroups !== undefined) {
        data.groups = [
          this.chartData.yGroups
        ];
      }
    }
    return data;
  }

  tooltip(): any {
    return { show: false };
  }
}
