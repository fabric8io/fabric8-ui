import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  Component,
  DebugElement,
  Input
} from '@angular/core';
import { By } from '@angular/platform-browser';

import { initContext, TestContext } from '../../../../../testing/test-context';

import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DeploymentStatusIconComponent } from './deployment-status-icon.component';

import { CpuStat } from '../models/cpu-stat';

const ICON_OK = 'pficon-ok';
const ICON_WARN = 'pficon-warning-triangle-o';
const ICON_ERR = 'pficon-error-circle-o';
const MSG_OK = 'Everything is ok.';

@Component({
  template: '<deployment-status-icon></deployment-status-icon>'
})
class HostComponent { }

describe('DeploymentStatusIconComponent', () => {
  type Context = TestContext<DeploymentStatusIconComponent, HostComponent>;

  let component: DeploymentStatusIconComponent;
  let fixture: ComponentFixture<DeploymentStatusIconComponent>;
  let stat: CpuStat;
  let mockCpuData: Subject<CpuStat> = new BehaviorSubject({ used: 1, quota: 5 } as CpuStat);

  initContext(DeploymentStatusIconComponent, HostComponent,
    { declarations: [DeploymentStatusIconComponent] },
    (component) => {component.cpuDataStream = mockCpuData; }
  );

  it('should set the button\'s initial value to ok', function(this: Context) {
    expect(this.testedDirective.iconClass).toBe('pficon-ok');
    expect(this.testedDirective.toolTip).toBe('Everything is ok.');
  });

  it('should change the button\'s value to warning if capacity changes', function(this: Context) {
    mockCpuData.next({ used: 4, quota: 5 } as CpuStat);
    this.detectChanges();
    expect(this.testedDirective.iconClass).toBe(ICON_WARN);
    expect(this.testedDirective.toolTip).toBe('CPU usage is approaching or at capacity.');
  });

  it('should change the button\s value to error if capacity is exceeded', function(this: Context) {
    mockCpuData.next({ used: 6, quota: 5 } as CpuStat);
    this.detectChanges();
    expect(this.testedDirective.iconClass).toBe(ICON_ERR);
    expect(this.testedDirective.toolTip).toBe('CPU usage has exceeded capacity.');
  });
});
