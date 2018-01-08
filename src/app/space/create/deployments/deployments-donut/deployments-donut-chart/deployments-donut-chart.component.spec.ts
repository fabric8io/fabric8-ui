import {
  Component,
  ViewChild
} from '@angular/core';
import { By } from '@angular/platform-browser';

import {
  initContext,
  TestContext
} from 'testing/test-context';

import { Observable } from 'rxjs';

import { DeploymentsDonutChartComponent } from './deployments-donut-chart.component';

@Component({
  template: `
    <deployments-donut-chart
    [colors]="colors"
    [mini]="mini"
    [pods]="pods | async"
    [desiredReplicas]="desiredReplicas"
    [idled]="isIdled">
    </deployments-donut-chart>
    `
})
class TestHostComponent {
  mini = false;
  pods = Observable.of({ pods: [['Running', 1], ['Terminating', 1]], total: 2 });
  desiredReplicas = 1;
  isIdled = false;
  colors = {
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
