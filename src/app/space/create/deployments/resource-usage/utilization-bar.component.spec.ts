import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  empty as emptyObservable,
  Observable,
  of,
  Subject
} from 'rxjs';
import { initContext, TestContext } from 'testing/test-context';
import { Stat } from '../models/stat';
import {
  Status,
  StatusType
} from '../services/deployment-status.service';
import { UtilizationBarComponent } from './utilization-bar.component';

@Component({
  template: '<utilization-bar></utilization-bar>'
})
class HostComponent { }

describe('UtilizationBarComponent', () => {

  describe('with valid Stat', () => {
    const testContext = initContext(UtilizationBarComponent, HostComponent, {}, (component: UtilizationBarComponent) => {
      component.resourceTitle = 'someTitle';
      component.resourceUnit = 'someUnit';
      component.stat = of({ used: 1, quota: 4 } as Stat);
      component.status = of({ type: StatusType.OK, message: '' });
    });

    it('should have proper stat fields set', function() {
      expect(testContext.testedDirective.used).toEqual(1);
      expect(testContext.testedDirective.total).toEqual(4);
      expect(testContext.testedDirective.usedPercent).toEqual(25);
      expect(testContext.testedDirective.unusedPercent).toEqual(75);
    });

    it('should have a properly set title', function() {
      let de = testContext.fixture.debugElement.query(By.css('.progress-description'));
      let el = de.nativeElement;
      expect(el.textContent.trim()).toEqual('someTitle (someUnit)');
    });

    it('should have properly set card label information', function() {
      let de = testContext.fixture.debugElement.query(By.css('#resourceCardLabel'));
      let el = de.nativeElement;
      expect(el.textContent.trim()).toEqual('1 of 4');
    });

    it('should clear warning when under 60% used', function() {
      expect(testContext.testedDirective.warn).toBeFalsy();

      let de = testContext.fixture.debugElement.query(By.css(`.utilization-okay`));
      expect(de).toBeTruthy();

      let de2 = testContext.fixture.debugElement.query(By.css(`.utilization-warning`));
      expect(de2).toBeFalsy();
    });
  });

  describe('with Warning level Stat', () => {
    const testContext = initContext(UtilizationBarComponent, HostComponent, {}, (component: UtilizationBarComponent) => {
      component.resourceTitle = 'someTitle';
      component.resourceUnit = 'someUnit';
      component.stat = of({ used: 3, quota: 4 } as Stat);
      component.status = of({ type: StatusType.WARN, message: '' });
    });

    it('should have proper stat fields set', function() {
      expect(testContext.testedDirective.used).toEqual(3);
      expect(testContext.testedDirective.total).toEqual(4);
      expect(testContext.testedDirective.usedPercent).toEqual(75);
      expect(testContext.testedDirective.unusedPercent).toEqual(25);
    });

    it('should have a properly set title', function() {
      let de = testContext.fixture.debugElement.query(By.css('.progress-description'));
      let el = de.nativeElement;
      expect(el.textContent.trim()).toEqual('someTitle (someUnit)');
    });

    it('should have properly set card label information', function() {
      let de = testContext.fixture.debugElement.query(By.css('#resourceCardLabel'));
      let el = de.nativeElement;
      expect(el.textContent.trim()).toEqual('3 of 4');
    });

    it('should set warning 60% or higher used', function() {
      expect(testContext.testedDirective.warn).toBeTruthy();

      let de = testContext.fixture.debugElement.query(By.css(`.utilization-okay`));
      expect(de).toBeFalsy();

      let de2 = testContext.fixture.debugElement.query(By.css(`.utilization-warning`));
      expect(de2).toBeTruthy();
    });
  });

  describe('with invalid Stat', () => {
    const testContext = initContext(UtilizationBarComponent, HostComponent, {}, (component: UtilizationBarComponent) => {
      component.resourceTitle = 'someTitle';
      component.resourceUnit = 'someUnit';
      component.stat = of({ used: 2, quota: 0 } as Stat);
      component.status = of({ type: StatusType.ERR, message: '' });
    });

    it('should have a properly set title', function() {
      let de = testContext.fixture.debugElement.query(By.css('.progress-description'));
      let el = de.nativeElement;
      expect(el.textContent.trim()).toEqual('someTitle (someUnit)');
    });

    it('should have properly set card label information', function() {
      let de = testContext.fixture.debugElement.query(By.css('#resourceCardLabel'));
      let el = de.nativeElement;
      expect(el.textContent.trim()).toEqual('2 of 0');
    });
  });

  describe('status', () => {
    const status: Subject<Status> = new Subject<Status>();
    const testContext = initContext(UtilizationBarComponent, HostComponent, {}, (component: UtilizationBarComponent) => {
      component.resourceTitle = 'someTitle';
      component.resourceUnit = 'someUnit';
      component.stat = emptyObservable();
      component.status = status;
    });

    it('should not warn on OK status', function() {
      status.next({ type: StatusType.OK, message: '' });
      expect(testContext.testedDirective.warn).toBeFalsy();
    });

    it('should warn on WARN status', function() {
      status.next({ type: StatusType.WARN, message: '' });
      expect(testContext.testedDirective.warn).toBeTruthy();
    });

    it('should warn on ERR status', function() {
      status.next({ type: StatusType.ERR, message: '' });
      expect(testContext.testedDirective.warn).toBeTruthy();
    });
  });
});
