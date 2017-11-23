import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Observable } from 'rxjs';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { ResourceCardComponent } from './resource-card.component';
import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';

describe('ResourceCardComponent', () => {
  let component: ResourceCardComponent;
  let fixture: ComponentFixture<ResourceCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ CollapseModule.forRoot() ],
      declarations: [ ResourceCardComponent ],
    });

    fixture = TestBed.createComponent(ResourceCardComponent);
    component = fixture.componentInstance;

    component.resourceTitle = 'mockResourceTitle';
    component.stat = Observable.of({ used: 3, total: 5 });

    fixture.detectChanges();
  });

  describe('supplied stat data', () => {
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
      de = fixture.debugElement.query(By.css('#resourceCardLabel'));
      el = de.nativeElement;
    });

    it('should be set from mockSvc function', () => {
      expect(el.textContent).toEqual('3 of 5');
    });
  });
});
