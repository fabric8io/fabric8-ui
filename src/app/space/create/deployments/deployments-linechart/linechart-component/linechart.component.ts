import {
  Component,
  DoCheck,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  ChartBase,
  ChartDefaults
} from 'patternfly-ng';

import {
  cloneDeep,
  defaultsDeep,
  isEqual,
  merge,
  uniqueId
} from 'lodash';

import { LinechartConfig } from './linechart-config';

import { LinechartData } from './linechart-data';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'linechart',
  templateUrl: './linechart.component.html'
})
export class LinechartComponent extends ChartBase implements DoCheck, OnInit {

  @Input() chartData: LinechartData;

  @Input() config: LinechartConfig;

  private defaultConfig: LinechartConfig;
  private prevChartData: LinechartData;
  private prevConfig: LinechartConfig;

  constructor(private chartDefaults: ChartDefaults) {
    super();
  }

  ngOnInit(): void {
    this.setupConfigDefaults();
    this.setupConfig();
    this.generateChart(this.config, true);
  }

  ngDoCheck(): void {
    if (!isEqual(this.config, this.prevConfig) || !isEqual(this.chartData, this.prevChartData)) {
      this.setupConfig();
      this.generateChart(this.config, true);
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
    this.defaultConfig = this.chartDefaults.getDefaultLineConfig();

    this.defaultConfig.chartId = uniqueId(this.config.chartId);
    this.defaultConfig.axis = {
      x: {
        show: this.config.showXAxis === true,
        type: 'timeseries',
        tick: {
          format: () => {
            return '';
          }
        }
      },
      y: {
        show: this.config.showYAxis === true,
        tick: {
          format: () => {
            return '';
          }
        }
      }
    };
    this.defaultConfig.grid.y.show = false;
    this.defaultConfig.point = { r: 0 };
    this.defaultConfig.size = { height: 100 };
    this.defaultConfig.legend = { show: false };
    this.defaultConfig.data = {
      type: 'line',
      columns: []
    };
    this.defaultConfig.data.colors = {
      sent: '#00b9e4', // pf-light-blue-400
      received: '#f39d3c' // pf-orange-300
    };
    // this.defaultConfig.tooltip = this.tooltip();
    this.defaultConfig.units = '';
  }

  protected getChartData(): any {
    let data: any = {};

    if (this.chartData && this.chartData.dataAvailable !== false && this.chartData.xData && this.chartData.yData) {
      data.x = this.chartData.xData[0];
      data.columns = [
        this.chartData.xData,
        ...this.chartData.yData
      ];
    }
    return data;
  }

}
