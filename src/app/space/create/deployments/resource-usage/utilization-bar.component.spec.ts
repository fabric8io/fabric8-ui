import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Observable } from 'rxjs';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { UtilizationBarComponent } from './utilization-bar.component';
import { Stat } from '../models/stat';

describe('UtilizationBarComponent', () => {
  describe('with valid Stat', () => {

    let component: UtilizationBarComponent;
    let fixture: ComponentFixture<UtilizationBarComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CollapseModule.forRoot()],
        declarations: [UtilizationBarComponent]
      });

      fixture = TestBed.createComponent(UtilizationBarComponent);
      component = fixture.componentInstance;

      component.resourceTitle = 'someTitle';
      component.resourceUnit = 'someUnit';
      component.stat = Observable.of({ used: 1, quota: 4 } as Stat);

      fixture.detectChanges();
    });

    it('should have proper stat fields set', () => {
      expect(component.used).toEqual(1);
      expect(component.total).toEqual(4);
      expect(component.usedPercent).toEqual(25);
      expect(component.unusedPercent).toEqual(75);
    });

    it('should have a properly set title', () => {
      let de = fixture.debugElement.query(By.css('.progress-description'));
      let el = de.nativeElement;
      expect(el.textContent.trim()).toEqual('someTitle (someUnit)');
    });

    it('should have properly set card label information', () => {
      let de = fixture.debugElement.query(By.css('#resourceCardLabel'));
      let el = de.nativeElement;
      expect(el.textContent.trim()).toEqual('1 of 4');
    });

    it('should set color to Okay when under 75% used', () => {
      expect(component.color).toEqual('#39a5dc');
    });
  });

  describe('with Warning level Stat', () => {

    let component: UtilizationBarComponent;
    let fixture: ComponentFixture<UtilizationBarComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CollapseModule.forRoot()],
        declarations: [UtilizationBarComponent]
      });

      fixture = TestBed.createComponent(UtilizationBarComponent);
      component = fixture.componentInstance;

      component.resourceTitle = 'someTitle';
      component.resourceUnit = 'someUnit';
      component.stat = Observable.of({ used: 3, quota: 4 } as Stat);

      fixture.detectChanges();
    });

    it('should have proper stat fields set', () => {
      expect(component.used).toEqual(3);
      expect(component.total).toEqual(4);
      expect(component.usedPercent).toEqual(75);
      expect(component.unusedPercent).toEqual(25);
    });

    it('should have a properly set title', () => {
      let de = fixture.debugElement.query(By.css('.progress-description'));
      let el = de.nativeElement;
      expect(el.textContent.trim()).toEqual('someTitle (someUnit)');
    });

    it('should have properly set card label information', () => {
      let de = fixture.debugElement.query(By.css('#resourceCardLabel'));
      let el = de.nativeElement;
      expect(el.textContent.trim()).toEqual('3 of 4');
    });

    it('should set color to Warning when 75% or higher used', () => {
      expect(component.color).toEqual('#f39d3c');
    });
  });

  describe('with invalid Stat', () => {

    let component: UtilizationBarComponent;
    let fixture: ComponentFixture<UtilizationBarComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CollapseModule.forRoot()],
        declarations: [UtilizationBarComponent]
      });

      fixture = TestBed.createComponent(UtilizationBarComponent);
      component = fixture.componentInstance;

      component.resourceTitle = 'someTitle';
      component.resourceUnit = 'someUnit';
      component.stat = Observable.of({ used: 2, quota: 0 } as Stat);

      fixture.detectChanges();
    });

    it('should have backup values in case it has a zero total', () => {
      expect(component.used).toEqual(2);
      expect(component.total).toEqual(0);
      expect(component.usedPercent).toEqual(0);
      expect(component.unusedPercent).toEqual(100);
    });

    it('should have a properly set title', () => {
      let de = fixture.debugElement.query(By.css('.progress-description'));
      let el = de.nativeElement;
      expect(el.textContent.trim()).toEqual('someTitle (someUnit)');
    });

    it('should have properly set card label information', () => {
      let de = fixture.debugElement.query(By.css('#resourceCardLabel'));
      let el = de.nativeElement;
      expect(el.textContent.trim()).toEqual('2 of 0');
    });
  });
});
