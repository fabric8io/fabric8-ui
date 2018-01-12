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

import { DeploymentsLinechartConfig } from './deployments-linechart-config';
import { DeploymentsLinechartData } from './deployments-linechart-data';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'deployments-linechart',
  templateUrl: './deployments-linechart.component.html',
  styleUrls: ['./deployments-linechart.component.less']
})
export class DeploymentsLinechartComponent extends ChartBase implements DoCheck, OnInit {

  @Input() chartData: DeploymentsLinechartData;

  @Input() config: DeploymentsLinechartConfig;

  private defaultConfig: DeploymentsLinechartConfig;
  private prevChartData: DeploymentsLinechartData;
  private prevConfig: DeploymentsLinechartConfig;

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
    this.defaultConfig = this.chartDefaults.getDefaultLineConfig();

    this.defaultConfig.chartId = uniqueId(this.config.chartId);
    this.defaultConfig.axis = {
      x: {
        show: this.config.showXAxis === true,
        type: 'timeseries',
        tick: {
          format: () => {
            return '';
          },
          outer: false
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
    this.defaultConfig.tooltip = this.tooltip();
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

  tooltip(): any {
    return {
      contents: (d: any) => {
        let tipRows: string = '';
        for (let i = 0; i < d.length; i++) {
          tipRows +=
          '<tr>' +
          '  <td class="value">' + d[i].name + '</td>' +
          '  <td class="value text-nowrap">' + d[i].value + '</td>' +
          '</tr>';
        }
        return this.getTooltipTableHTML(tipRows);
      },
      position: (data: any, width: number, height: number, element: any) => {
        let center;
        let top;
        let chartBox;
        let graphOffsetX;
        let x;

        try {
          center = parseInt(element.getAttribute('x'), 10);
          top = parseInt(element.getAttribute('y'), 10);
          chartBox = document.querySelector('#' + this.config.chartId).getBoundingClientRect();
          graphOffsetX = document.querySelector('#' + this.config.chartId + ' g.c3-axis-y')
            .getBoundingClientRect().right;
          x = Math.max(0, center + graphOffsetX - chartBox.left - Math.floor(width / 2));

          return {
            top: top - height,
            left: Math.min(x, chartBox.width - width)
          };
        } catch (e) {
        }
      }
    };
  }

  private getTooltipTableHTML(tipRows: any): string {
    return '<div class="module-triangle-bottom">' +
      '  <table class="c3-tooltip">' +
      '    <tbody>' +
      tipRows +
      '    </tbody>' +
      '  </table>' +
      '</div>';
  }

}
