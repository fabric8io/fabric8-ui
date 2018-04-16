import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import {
  initContext,
  TestContext
} from 'testing/test-context';

import { PodPhase } from '../../models/pod-phase';
import { Pods } from '../../models/pods';

import { DeploymentsDonutChartComponent } from './deployments-donut-chart.component';

@Component({
  template: `
    <deployments-donut-chart
    [colors]="colors"
    [mini]="mini"
    [pods]="pods"
    [desiredReplicas]="desiredReplicas"
    [idled]="isIdled">
    </deployments-donut-chart>
    `
})
class TestHostComponent {
  mini = false;
  pods: Pods = { pods: [['Running' as PodPhase, 1], ['Terminating' as PodPhase, 1]], total: 2 };
  desiredReplicas: number = 1;
  isIdled: boolean = false;
  colors: { [s in PodPhase]: string } = {
    'Empty': '#030303', // pf-black
    'Running': '#00b9e4', // pf-light-blue-400
    'Not Ready': '#beedf9', // pf-light-blue-100
    'Warning': '#f39d3c', // pf-orange-300
    'Error': '#cc0000', // pf-red-100
    'Pulling': '#d1d1d1', // pf-black-300
    'Pending': '#ededed', // pf-black-200
    'Succeeded': '#3f9c35', // pf-green-400
    'Terminating': '#00659c', // pf-blue-500
    'Unknown': '#f9d67a' // pf-gold-200
  };
}

describe('DeploymentsDonutChartComponent', () => {
  type Context = TestContext<DeploymentsDonutChartComponent, TestHostComponent>;
  initContext(DeploymentsDonutChartComponent, TestHostComponent);

  it('should set unique chartId', function(this: Context) {
    expect(this.testedDirective.chartId).toMatch('deployments-donut-chart.*');
  });

  it('should not show mini text', function(this: Context) {
    expect(this.testedDirective.mini).toBe(false);
    let text = this.fixture.debugElement.query(By.css('deployments-donut-chart-mini-text'));
    expect(text).toBeFalsy();
  });

  describe('Mini chart', () => {
    beforeEach(function(this: Context) {
      this.hostComponent.mini = true;
      this.detectChanges();
    });

    it('should show mini text', function(this: Context) {
      expect(this.testedDirective.mini).toBe(true);
      let text = this.fixture.debugElement.query(By.css('.deployments-donut-chart-mini-text'));
      expect(text).toBeTruthy();
      let textEl = text.nativeElement;
      expect(textEl.innerText).toEqual('2 pods');
    });

    it('should show pods status', function(this: Context) {
      let runningText = this.fixture.debugElement.query(By.css('#pod_status_Running'));
      expect(runningText).toBeTruthy();
      expect(runningText.nativeElement.innerText).toBe('1 Running');

      let terminating = this.fixture.debugElement.query(By.css('#pod_status_Terminating'));
      expect(terminating).toBeTruthy();
      expect(terminating.nativeElement.innerText).toBe('1 Terminating');
    });

    describe('Mini Idle chart', () => {
      beforeEach(function(this: Context) {
        this.hostComponent.isIdled = true;
        this.detectChanges();
      });

      it('should show idled text', function(this: Context) {
        expect(this.testedDirective.idled).toBe(true);
        let idle = this.fixture.debugElement.query(By.css('.deployments-donut-chart-mini-text'));
        expect(idle).toBeTruthy();
        let idleEl = idle.nativeElement;
        expect(idleEl.innerText).toEqual('Idle');
      });
    });
  });
});
