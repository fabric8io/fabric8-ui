import {
  AfterViewInit,
  AfterViewChecked,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { debounce, get, isEqual, reject, size, uniqueId } from 'lodash';
import { Observable } from 'rxjs';

import { Pods } from '../../models/pods';

import * as c3 from 'c3';
import * as d3 from 'd3';

@Component({
  selector: 'deployments-donut-chart',
  templateUrl: './deployments-donut-chart.component.html',
  styleUrls: ['./deployments-donut-chart.component.less']
})
export class DeploymentsDonutChartComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {

  @Input() pods: Pods;
  @Input() mini: boolean;
  @Input() desiredReplicas: number;
  @Input() idled: boolean;

  chartId = uniqueId('deployments-donut-chart');
  debounceUpdateChart = debounce(this.updateChart, 350, { maxWait: 500 });

  private phases = [
    'Running',
    'Not Ready',
    'Warning',
    'Error',
    'Pulling',
    'Pending',
    'Succeeded',
    'Terminating',
    'Unknown'
  ];

  private config: any;
  private chart: any;

  constructor() { }

  ngOnInit(): void {
    this.config = {
      type: 'donut',
      bindto: '#' + this.chartId,
      donut: {
        expand: false,
        label: {
          show: false
        },
        width: this.mini ? 5 : 10
      },
      size: {
        height: this.mini ? 45 : 150,
        width: this.mini ? 45 : 150
      },
      legend: {
        show: false
      },
      tooltip: {
        format: {
          value: function (value, ratio, id) {
            if (!value) {
              return undefined;
            }
            if (id === 'Empty') {
              return undefined;
            }

            return value;
          }
        }
      },
      transition: {
        duration: 350
      },
      data: {
        type: 'donut',
        groups: [this.phases],
        order: null,
        colors: {
          'Empty': '#ffffff', // black
          'Running': '#00b9e4', // dark blue
          'Not Ready': '#beedf9', // light blue
          'Warning': '#f39d3c', // orange
          'Error': '#d9534f', // red
          'Pulling': '#d1d1d1', // grey
          'Pending': '#ededed', // light grey
          'Succeeded': '#3f9c35', // green
          'Terminating': '#00659c', // dark blue
          'Unknown': '#f9d67a' // light yellow
        },
        selection: {
          enabled: false
        }
      }
    };

    if (this.mini) {
      this.config.padding = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }
  }

  ngAfterViewInit(): void {
    this.config.data.columns = this.pods.pods;
    this.chart = c3.generate(this.config);
    this.updateCountText();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.desiredReplicas && !changes.desiredReplicas.firstChange) ||
      (changes.idled && !changes.idled.firstChange)) {
      this.updateCountText();
    }

    if (changes.pods && !changes.pods.firstChange && !isEqual(changes.pods.previousValue, changes.pods.currentValue)) {
      this.debounceUpdateChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart = this.chart.destroy();
    }
  }

  private updateCountText(): void {
    if (!this.mini) {
      let smallText: string;
      if (isNaN(this.desiredReplicas) || this.desiredReplicas === this.pods.total) {
        smallText = (this.pods.total === 1) ? 'pod' : 'pods';
      } else {
        smallText = `scaling to ${this.desiredReplicas}...`;
      }

      if (this.idled) {
        this.updateDonutCenterText('Idle');
      } else {
        this.updateDonutCenterText(this.pods.total, smallText);
      }
    }
  }

  private updateChart(): void {
    if (this.chart) {
      this.config.data.columns = this.pods.pods;
      this.chart.load(this.config.data);
      this.updateCountText();
    }
  }

  private updateDonutCenterText(bigText: string | number, smallText?: string | number): void {
    let donutChartTitle;

    if (!this.chart) {
      return;
    }

    donutChartTitle = d3.select(this.chart.element).select('text.c3-chart-arcs-title');
    if (!donutChartTitle) {
      return;
    }

    donutChartTitle.text('');
    if (bigText && !smallText) {
      donutChartTitle.text(bigText);
    } else {
      donutChartTitle.insert('tspan', null).text(bigText)
        .classed('donut-title-big-pf', true).attr('dy', 0).attr('x', 0);
      donutChartTitle.insert('tspan', null).text(smallText).
        classed('donut-title-small-pf', true).attr('dy', 20).attr('x', 0);
    }
  }
}
