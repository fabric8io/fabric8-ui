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
