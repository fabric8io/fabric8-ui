import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { BehaviorSubject,  never as observableNever, Observable } from 'rxjs';
import { initContext, TestContext } from 'testing/test-context';
import { PipelineStage } from '../../../../a-runtime-console/kubernetes/model/pipelinestage.model';
import { ApplicationsListItemDetailsComponent } from './applications-list-item-details.component';

@Component({
  selector: 'fabric8-applications-pipeline',
  template: ''
})
class FakeApplicationsPipelineComponent {
  @Input() stage: PipelineStage;
  @Input() showLine: boolean;
}

@Component({
  template: '<fabric8-applications-list-item-details></fabric8-applications-list-item-details>'
})
class HostComponent { }

describe('ApplicationsListItemDetailsComponent', () => {
  type TestingContext = TestContext<ApplicationsListItemDetailsComponent, HostComponent>;

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
      recent: observableNever(),
      default: observableNever()
    };
  });

  initContext(ApplicationsListItemDetailsComponent, HostComponent, {
    imports: [
      CommonModule
    ],
    declarations: [
      FakeApplicationsPipelineComponent
    ],
    providers: [
      { provide: Contexts, useFactory: () => contexts }
    ]
  }, (component: ApplicationsListItemDetailsComponent): void => {
    component.build = build as any;
  });

  describe('Applications list item details with build', () => {
    it('Build should be set', function(this: TestingContext) {
      expect(this.testedDirective.build as any).toEqual(build);
    });

    it('Pipeline stages should be trimmed', function(this: TestingContext) {
      let stages = this.testedDirective.pipelineStages as any[];
      expect(stages.length).toBe(2);
    });

    it('Pipeline stages should be set', function(this: TestingContext) {
      let stages = this.testedDirective.pipelineStages as any[];
      expect(stages[0].name).toEqual('Approve');
      expect(stages[1].name).toEqual('Rollout to Run');
    });

    it('Current stage should be set', function(this: TestingContext) {
      let stages = this.testedDirective.pipelineStages as any[];
      expect(stages[1].currentStage).toBeTruthy();
    });
  });
});
