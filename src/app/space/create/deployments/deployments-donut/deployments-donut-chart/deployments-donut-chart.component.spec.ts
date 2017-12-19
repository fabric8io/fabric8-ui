import { Component, DebugElement, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { isEqual } from 'lodash';
import { Observable } from 'rxjs';

import { DeploymentsDonutChartComponent } from './deployments-donut-chart.component';

describe('DeploymentsDonutChartComponent', () => {
  @Component({
    template: `
    <deployments-donut-chart [mini]="mini" [pods]="pods | async" [desiredReplicas]="desiredReplicas" [idled]="isIdled">
    </deployments-donut-chart>
    `
  })
  class TestHostComponent {
    mini = false;
    pods = Observable.of({ pods: [['Running', 1], ['Terminating', 1]], total: 2 });
    desiredReplicas = 1;
    isIdled = false;

    @ViewChild(DeploymentsDonutChartComponent)
    childComponent: DeploymentsDonutChartComponent;
  }

  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeploymentsDonutChartComponent, TestHostComponent]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should set unique chartId', () => {
    expect(hostComponent.childComponent.chartId).toMatch('deployments-donut-chart.*');
  });

  it('should not show mini text', () => {
    expect(hostComponent.childComponent.mini).toBe(false);
    de = fixture.debugElement.query(By.css('deployments-donut-chart-mini-text'));
    expect(de).toBeFalsy();
  });

  describe('Mini chart', () => {
    beforeEach(() => {
      hostComponent.mini = true;
      fixture.detectChanges();
    });

    it('should show mini text', () => {
      expect(hostComponent.childComponent.mini).toBe(true);
      de = fixture.debugElement.query(By.css('.deployments-donut-chart-mini-text'));
      expect(de).toBeTruthy();
      el = de.nativeElement;
      expect(el.innerText).toEqual('2 pods');
    });

    describe('Mini Idle chart', () => {
      beforeEach(() => {
        hostComponent.isIdled = true;
        fixture.detectChanges();
      });

      it('should show idled text', () => {
        expect(hostComponent.childComponent.idled).toBe(true);
        de = fixture.debugElement.query(By.css('.deployments-donut-chart-mini-text'));
        expect(de).toBeTruthy();
        el = de.nativeElement;
        expect(el.innerText).toEqual('Idle');
      });
    });
  });
});
