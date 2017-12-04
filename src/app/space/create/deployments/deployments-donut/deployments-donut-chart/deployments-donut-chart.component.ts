import { Component, DoCheck, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { debounce, get, isEqual, reject, size, uniqueId } from 'lodash';

import * as c3 from 'c3';
import * as d3 from 'd3';

@Component({
  selector: 'deployments-donut-chart',
  templateUrl: './deployments-donut-chart.component.html',
  styleUrls: ['./deployments-donut-chart.component.less']
})
export class DeploymentsDonutChartComponent implements DoCheck, OnInit, OnChanges, OnDestroy {

  @Input() pods: any[];
  @Input() mini: boolean;
  @Input() desiredReplicas: number;
  @Input() idled: boolean;

  chartId = uniqueId('deployments-donut-chart');
  podStatusData: any;
  total: number;

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


  private debounceUpdate = debounce(this.updateChart, 350, { maxWait: 500 });
  private prevPodPhaseCount: any;

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

  ngDoCheck(): void {
    let podPhaseCount = this.countPodPhases();
    if (!isEqual(this.prevPodPhaseCount, podPhaseCount)) {
      this.prevPodPhaseCount = podPhaseCount;
      this.debounceUpdate(podPhaseCount);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.desiredReplicas.firstChange || !changes.idled.firstChange) {
      this.updatePodCount();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart = this.chart.destroy();
    }
  }

  private updatePodCount(): void {
    let pods = reject(this.pods, { status: { phase: 'Failed' } });
    let total = size(this.pods);

    if (this.mini) {
      this.total = total;
      return;
    }

    let smallText: string;
    if (isNaN(this.desiredReplicas) || this.desiredReplicas === total) {
      smallText = (total === 1) ? 'pod' : 'pods';
    } else {
      smallText = `scaling to ${this.desiredReplicas}...`;
    }

    if (this.idled) {
      this.updateCenterText('Idle');
    } else {
      this.updateCenterText(total, smallText);
    }
  }

  private updateChart(countByPhase: any): void {
    let columns = [];
    this.phases.forEach((phase) => {
      columns.push([phase, countByPhase[phase] || 0]);
    });

    if (!this.chart) {
      this.config.data.columns = columns;
      this.chart = c3.generate(this.config);
    } else {
      this.chart.load(this.config.data);
    }

    this.podStatusData = columns;

    this.updatePodCount();
  }

  // TODO : get correct phases

  // private isReady(pod: any): boolean {
  //   let numReady = this.numContainersReadyFilter(pod);
  //   let total = size(pod.spec.containers);

  //   return numReady === total;
  // }

  private getPhase(pod: any): any {
    // if (this.isTerminatingFilter(pod)) {
    //   return 'Terminating';
    // }

    // let warnings = this.podWarningsFilter(pod);
    // if (some(warnings, { severity: 'error' })) {
    //   return 'Error';
    // } else if (isEmpty(warnings)) {
    //   return 'Warning';
    // }

    // if (this.isPullingImageFilter(pod)) {
    //   return 'Pulling';
    // }

    // Also count running, but not ready, as its own phase.
    // if (pod.status.phase === 'Running' && !this.isReady(pod)) {
    //   return 'Not Ready';
    // }

    return get(pod, 'status.phase', 'Unknown');
  }

  private countPodPhases(): any {
    let countByPhase = {};

    this.pods.forEach(pod => {
      let phase = this.getPhase(pod);
      countByPhase[phase] = (countByPhase[phase] || 0) + 1;
    });

    return countByPhase;
  }

  private updateCenterText(bigText: string | number, smallText?: string | number): void {
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
