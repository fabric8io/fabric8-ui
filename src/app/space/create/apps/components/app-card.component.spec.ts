import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Observable } from 'rxjs';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AppCardComponent } from './app-card.component';
import { AppsService } from '../services/apps.service';

describe('AppCardComponent', () => {

  let component: AppCardComponent;
  let fixture: ComponentFixture<AppCardComponent>;
  let mockSvc: AppsService;

  beforeEach(() => {
    mockSvc = {
      getApplications: () => { throw 'Not Implemented'; },
      getEnvironments: () => { throw 'Not Implemented'; },
      getPodCount: () => Observable.of(2),
      getVersion: () => Observable.of('1.2.3'),
      getCpuStat: () => { throw 'Not Implemented'; },
      getMemoryStat: () => { throw 'Not Implemented'; }
    };

    spyOn(mockSvc, 'getApplications').and.callThrough();
    spyOn(mockSvc, 'getEnvironments').and.callThrough();
    spyOn(mockSvc, 'getPodCount').and.callThrough();
    spyOn(mockSvc, 'getCpuStat').and.callThrough();
    spyOn(mockSvc, 'getMemoryStat').and.callThrough();
    spyOn(mockSvc, 'getVersion').and.callThrough();

    TestBed.configureTestingModule({
      imports: [ CollapseModule.forRoot() ],
      declarations: [ AppCardComponent ],
      providers: [ { provide: AppsService, useValue: mockSvc } ]
    });

    fixture = TestBed.createComponent(AppCardComponent);
    component = fixture.componentInstance;

    component.applicationId = 'mockAppId';
    component.environment = { environmentId: 'mockEnvironmentId', name: 'mockEnvironment'};

    fixture.detectChanges();
  });

  describe('podCountLabel', () => {
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
      de = fixture.debugElement.query(By.css('#podCountLabel'));
      el = de.nativeElement;
    });

    it('should be set from mockSvc.getPodCount result', () => {
      expect(mockSvc.getPodCount).toHaveBeenCalledWith('mockAppId', 'mockEnvironmentId');
      expect(el.textContent).toEqual('2 Pods');
    });
  });

  describe('versionLabel', () => {
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
      de = fixture.debugElement.query(By.css('#versionLabel'));
      el = de.nativeElement;
    });

    it('should be set from mockSvc.getVersion result', () => {
      expect(mockSvc.getVersion).toHaveBeenCalledWith('mockAppId', 'mockEnvironmentId');
      expect(el.textContent).toEqual('1.2.3');
    });
  });

});
