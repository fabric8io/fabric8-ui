import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import * as c3 from 'c3';
import * as d3 from 'd3';
import {
  debounce,
  isEqual,
  uniqueId
} from 'lodash';

import { PodPhase } from '../../models/pod-phase';
import { Pods } from '../../models/pods';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'deployments-donut-chart',
  templateUrl: './deployments-donut-chart.component.html',
  styleUrls: ['./deployments-donut-chart.component.less']
})
export class DeploymentsDonutChartComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {

  @Input() pods: Pods;
  @Input() mini: boolean;
  @Input() desiredReplicas: number;
  @Input() idled: boolean;
  @Input() colors: any;

  chartId = uniqueId('deployments-donut-chart');
  debounceUpdateChart = debounce(this.updateChart, 350, { maxWait: 500 });

  private config: any;
  private chart: any;

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
          value: function(value, ratio, id) {
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
        duration: 0
      },
      data: {
        type: 'donut',
        groups: [Object.keys(PodPhase).map(p => PodPhase[p]).filter(p => p !== PodPhase.EMPTY)],
        order: null,
        colors: this.colors,
        selection: {
          enabled: false
        },
        columns: [
          ['Empty', 1]
        ],
        unload: true
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
    this.chart = c3.generate(this.config);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pods && !isEqual(changes.pods.previousValue, changes.pods.currentValue)) {
      this.debounceUpdateChart();
    }
    if ((changes.desiredReplicas && !changes.desiredReplicas.firstChange) ||
      (changes.idled && !changes.idled.firstChange)) {
      this.updateCountText();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.unload({ done: () => this.chart = this.chart.destroy() });
    }
  }

  private updateCountText(): void {
    if (!this.mini && this.pods) {
      let smallText: string;
      if (this.desiredReplicas == null || this.desiredReplicas === this.pods.total) {
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
    if (this.chart && this.pods) {
      if (this.pods.total === 0) {
        this.config.data.columns = [['Empty', 1]];
      } else {
        this.config.data.columns = this.pods.pods;
      }
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
