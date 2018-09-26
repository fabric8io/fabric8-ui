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
  const testContext = initContext(DeploymentsDonutChartComponent, TestHostComponent);

  it('should set unique chartId', function() {
    expect(testContext.testedDirective.chartId).toMatch(/deployments\-donut\-chart.*/);
  });

  it('should not show mini text', function() {
    expect(testContext.testedDirective.mini).toBe(false);
    let text = testContext.fixture.debugElement.query(By.css('deployments-donut-chart-mini-text'));
    expect(text).toBeFalsy();
  });

  describe('Mini chart', () => {
    beforeEach(function() {
      testContext.hostComponent.mini = true;
      testContext.detectChanges();
    });

    it('should show mini text', function() {
      expect(testContext.testedDirective.mini).toBe(true);
      let text = testContext.fixture.debugElement.query(By.css('.deployments-donut-chart-mini-text'));
      expect(text).toBeTruthy();
      let textEl = text.nativeElement;
      expect(textEl.textContent.trim()).toEqual('2 pods');
    });

    it('should show pods status', function() {
      let runningText = testContext.fixture.debugElement.query(By.css('#pod_status_Running'));
      expect(runningText).toBeTruthy();
      expect(runningText.nativeElement.textContent.trim()).toBe('1 Running');

      let terminating = testContext.fixture.debugElement.query(By.css('#pod_status_Terminating'));
      expect(terminating).toBeTruthy();
      expect(terminating.nativeElement.textContent.trim()).toBe('1 Terminating');
    });

    describe('Mini Idle chart', () => {
      beforeEach(function() {
        testContext.hostComponent.isIdled = true;
        testContext.detectChanges();
      });

      it('should show idled text', function() {
        expect(testContext.testedDirective.idled).toBe(true);
        let idle = testContext.fixture.debugElement.query(By.css('.deployments-donut-chart-mini-text'));
        expect(idle).toBeTruthy();
        let idleEl = idle.nativeElement;
        expect(idleEl.textContent.trim()).toEqual('Idle');
      });
    });
  });
});
