import {
  Component,
  DebugElement
} from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  empty,
  of,
  Subject
} from 'rxjs';
import { initContext } from 'testing/test-context';

import {
  Status,
  StatusType
} from '../services/deployment-status.service';
import { UtilizationBarComponent } from './utilization-bar.component';

@Component({
  template: '<utilization-bar></utilization-bar>'
})
class HostComponent { }

describe('UtilizationBarComponent', (): void => {

  describe('with valid Stat', (): void => {
    const testContext = initContext(UtilizationBarComponent, HostComponent, {}, (component: UtilizationBarComponent): void => {
      component.resourceTitle = 'someTitle';
      component.resourceUnit = 'someUnit';
      component.stat = of({ used: 1, quota: 4 });
      component.status = of({ type: StatusType.OK, message: '' });
    });

    it('should have proper stat fields set', (): void => {
      expect(testContext.testedDirective.used).toEqual(1);
      expect(testContext.testedDirective.total).toEqual(4);
      expect(testContext.testedDirective.usedPercent).toEqual(25);
      expect(testContext.testedDirective.unusedPercent).toEqual(75);
    });

    it('should have a properly set title', (): void => {
      const de: DebugElement = testContext.fixture.debugElement.query(By.css('.progress-description'));
      const el: HTMLElement = de.nativeElement;
      expect(el.textContent.trim()).toEqual('someTitle (someUnit)');
    });

    it('should have properly set card label information', function() {
      const de: DebugElement = testContext.fixture.debugElement.query(By.css('#resourceCardLabel'));
      const el: HTMLElement = de.nativeElement;
      expect(el.textContent.trim()).toEqual('1 of 4');
    });

    it('should clear warning when under 60% used', function() {
      expect(testContext.testedDirective.warn).toBeFalsy();

      const de: DebugElement = testContext.fixture.debugElement.query(By.css(`.utilization-okay`));
      expect(de).toBeTruthy();

      const de2: DebugElement = testContext.fixture.debugElement.query(By.css(`.utilization-warning`));
      expect(de2).toBeFalsy();
    });
  });

  describe('with Warning level Stat', (): void => {
    const testContext = initContext(UtilizationBarComponent, HostComponent, {}, (component: UtilizationBarComponent): void => {
      component.resourceTitle = 'someTitle';
      component.resourceUnit = 'someUnit';
      component.stat = of({ used: 3, quota: 4 });
      component.status = of({ type: StatusType.WARN, message: '' });
    });

    it('should have proper stat fields set', (): void => {
      expect(testContext.testedDirective.used).toEqual(3);
      expect(testContext.testedDirective.total).toEqual(4);
      expect(testContext.testedDirective.usedPercent).toEqual(75);
      expect(testContext.testedDirective.unusedPercent).toEqual(25);
    });

    it('should have a properly set title', (): void => {
      const de: DebugElement = testContext.fixture.debugElement.query(By.css('.progress-description'));
      const el: HTMLElement = de.nativeElement;
      expect(el.textContent.trim()).toEqual('someTitle (someUnit)');
    });

    it('should have properly set card label information', (): void => {
      const de: DebugElement = testContext.fixture.debugElement.query(By.css('#resourceCardLabel'));
      const el: HTMLElement = de.nativeElement;
      expect(el.textContent.trim()).toEqual('3 of 4');
    });

    it('should set warning 60% or higher used', (): void => {
      expect(testContext.testedDirective.warn).toBeTruthy();

      const de: DebugElement = testContext.fixture.debugElement.query(By.css(`.utilization-okay`));
      expect(de).toBeFalsy();

      const de2: DebugElement = testContext.fixture.debugElement.query(By.css(`.utilization-warning`));
      expect(de2).toBeTruthy();
    });
  });

  describe('with invalid Stat', (): void => {
    const testContext = initContext(UtilizationBarComponent, HostComponent, {}, (component: UtilizationBarComponent): void => {
      component.resourceTitle = 'someTitle';
      component.resourceUnit = 'someUnit';
      component.stat = of({ used: 2, quota: 0 });
      component.status = of({ type: StatusType.ERR, message: '' });
    });

    it('should have a properly set title', (): void => {
      const de: DebugElement = testContext.fixture.debugElement.query(By.css('.progress-description'));
      const el: HTMLElement = de.nativeElement;
      expect(el.textContent.trim()).toEqual('someTitle (someUnit)');
    });

    it('should have properly set card label information', (): void => {
      const de: DebugElement = testContext.fixture.debugElement.query(By.css('#resourceCardLabel'));
      const el: HTMLElement = de.nativeElement;
      expect(el.textContent.trim()).toEqual('2 of 0');
    });
  });

  describe('status', (): void => {
    const status: Subject<Status> = new Subject<Status>();
    const testContext = initContext(UtilizationBarComponent, HostComponent, {}, (component: UtilizationBarComponent): void => {
      component.resourceTitle = 'someTitle';
      component.resourceUnit = 'someUnit';
      component.stat = empty();
      component.status = status;
    });

    it('should not warn on OK status', (): void => {
      status.next({ type: StatusType.OK, message: '' });
      expect(testContext.testedDirective.warn).toBeFalsy();
    });

    it('should warn on WARN status', (): void => {
      status.next({ type: StatusType.WARN, message: '' });
      expect(testContext.testedDirective.warn).toBeTruthy();
    });

    it('should warn on ERR status', (): void => {
      status.next({ type: StatusType.ERR, message: '' });
      expect(testContext.testedDirective.warn).toBeTruthy();
    });
  });
});
