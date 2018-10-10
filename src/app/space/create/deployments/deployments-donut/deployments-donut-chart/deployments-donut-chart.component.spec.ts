import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { initContext } from 'testing/test-context';
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
  pods: Pods = { pods: [[PodPhase.RUNNING, 1], [PodPhase.TERMINATING, 1]], total: 2 };
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

describe('DeploymentsDonutChartComponent', (): void => {
  const testContext = initContext(DeploymentsDonutChartComponent, TestHostComponent);

  it('should set unique chartId', (): void => {
    expect(testContext.testedDirective.chartId).toMatch(/deployments\-donut\-chart.*/);
  });

  it('should not show mini text', (): void => {
    expect(testContext.testedDirective.mini).toBe(false);
    const text: DebugElement = testContext.fixture.debugElement.query(By.css('deployments-donut-chart-mini-text'));
    expect(text).toBeFalsy();
  });

  describe('Mini chart', (): void => {
    beforeEach((): void => {
      testContext.hostComponent.mini = true;
      testContext.detectChanges();
    });

    // FIXME test fails intermittently
    xit('should show mini text', (): void => {
      expect(testContext.testedDirective.mini).toBe(true);
      const text: DebugElement = testContext.fixture.debugElement.query(By.css('.deployments-donut-chart-mini-text'));
      expect(text).toBeTruthy();
      const textEl: HTMLElement = text.nativeElement;
      expect(textEl.textContent.trim()).toEqual('2 pods');
    });

    // FIXME test fails intermittently
    xit('should show pods status', (): void => {
      const runningText: DebugElement = testContext.fixture.debugElement.query(By.css('#pod_status_Running'));
      expect(runningText).toBeTruthy();
      expect(runningText.nativeElement.textContent.trim()).toBe('1 Running');

      const terminating: DebugElement = testContext.fixture.debugElement.query(By.css('#pod_status_Terminating'));
      expect(terminating).toBeTruthy();
      expect(terminating.nativeElement.textContent.trim()).toBe('1 Terminating');
    });

    describe('Mini Idle chart', (): void => {
      beforeEach((): void => {
        testContext.hostComponent.isIdled = true;
        testContext.detectChanges();
      });

      // FIXME test fails intermittently
      xit('should show idled text', (): void => {
        expect(testContext.testedDirective.idled).toBe(true);
        const idle: DebugElement = testContext.fixture.debugElement.query(By.css('.deployments-donut-chart-mini-text'));
        expect(idle).toBeTruthy();
        const idleEl: HTMLElement = idle.nativeElement;
        expect(idleEl.textContent.trim()).toEqual('Idle');
      });
    });
  });
});
