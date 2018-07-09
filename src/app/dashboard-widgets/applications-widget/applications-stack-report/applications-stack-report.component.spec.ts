import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { initContext, TestContext } from 'testing/test-context';

import { Context, Contexts } from 'ngx-fabric8-wit';

import { ApplicationsStackReportComponent } from './applications-stack-report.component';

@Component({
  selector: 'stack-details',
  template: ''
})
class FakeStackDetailsComponent {
  @Input() buildNumber: number;
  @Input() appName: string;
  @Input() repoInfo: any;
  @Input() stack: boolean;
}

@Component({
  template: '<fabric8-applications-stack-report></fabric8-applications-stack-report>'
})
class HostComponent { }

describe('ApplicationsStackReportComponent', () => {
  type TestingContext = TestContext<ApplicationsStackReportComponent, HostComponent>;

  let contexts: Contexts;

  let build = {
    buildNumber: '1',
    firstPendingInputAction: {
      proceedUrl: 'https://example.com/app1.git'
    },
    jenkinsNamespace: 'namespace-jenkins',
    pipelineStages: [{
      jenkinsInputURL: 'https://example.com/app1.git',
      name: 'Build Release',
      status: 'SUCCESS'
    }, {
      jenkinsInputURL: 'https://example.com/app1.git',
      name: 'Rollout to Stage',
      serviceUrl: 'https://example.com/app1.git',
      status: 'SUCCESS'
    }, {
      jenkinsInputURL: 'https://example.com/app1.git',
      name: 'Approve',
      status: 'SUCCESS'
    }, {
      jenkinsInputURL: 'https://example.com/app1.git',
      name: 'Rollout to Run',
      serviceUrl: 'https://example.com/app1.git',
      status: 'SUCCESS'
    }],
    statusPhase: 'Complete'
  };

  let mockRouterEvent: any = {
    'id': 1,
    'url': 'mock-url'
  };

  beforeEach(() => {
    contexts = {
      current: new BehaviorSubject<Context>({
        name: 'space',
        path: '/user/space',
        space: {
          attributes: {
            name: 'space'
          }
        }
      } as Context),
      recent: Observable.never(),
      default: Observable.never()
    };
  });

  initContext(ApplicationsStackReportComponent, HostComponent, {
    imports: [
      CommonModule
    ],
    declarations: [
      FakeStackDetailsComponent
    ],
    providers: [
      { provide: Contexts, useFactory: () => contexts }
    ]
  }, (component: ApplicationsStackReportComponent): void => {
    component.build = build as any;
  });

  describe('Applications stack report with build', () => {
    it('Build should be set', function(this: TestingContext) {
      expect(this.testedDirective.build as any).toEqual(build);
    });

    it('Pipelines should be set', function(this: TestingContext) {
      expect(this.testedDirective.pipelineStages as any[]).toEqual(build.pipelineStages);
    });

    it('Should call showStackReport', function(this: TestingContext) {
      let mockElement = document.createElement('a');
      spyOn(this.testedDirective.stackReport.nativeElement, 'querySelector').and.returnValue(mockElement);
      spyOn(mockElement, 'click');

      // this.testedDirective.stackReport = mockElementRef;
      this.testedDirective.showStackReport();
      expect(mockElement.click).toHaveBeenCalled();
    });
  });
});
