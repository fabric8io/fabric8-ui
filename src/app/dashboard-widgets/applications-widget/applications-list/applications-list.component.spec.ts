import { CommonModule } from '@angular/common';
import {
  Component,
  Input
} from '@angular/core';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { BehaviorSubject,  never as observableNever, Observable } from 'rxjs';
import { initContext, TestContext } from 'testing/test-context';
import { BuildConfig } from '../../../../a-runtime-console/index';
import { ApplicatonsListComponent } from './applicatons-list.component';

@Component({
  selector: 'fabric8-applications-list-item',
  template: ''
})
class FakeApplicationsListItemComponent {
  @Input() buildConfig: BuildConfig;
}

@Component({
  template: '<fabric8-applications-list></fabric8-applications-list>'
})
class HostComponent { }

describe('ApplicatonsListComponent', () => {
  type TestingContext = TestContext<ApplicatonsListComponent, HostComponent>;

  let contexts: Contexts;

  let buildConfig1 = {
    id: 'app1',
    name: 'app1',
    gitUrl: 'https://example.com/app1.git',
    interestingBuilds: [{
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
    }],
    labels: {
      space: 'space1'
    },
    serviceUrls: [{
      environmentName: 'Run',
      name: 'app1',
      url: 'https://example.com/app1.git'
    }, {
      environmentName: 'Stage',
      name: 'app1',
      url: 'https://example.com/app1.git'
    }]
  };

  let buildConfig2 = {
    id: 'app2',
      name: 'app2',
    gitUrl: 'https://example.com/app2.git',
    interestingBuilds: [{
      buildNumber: '1',
      firstPendingInputAction: {
        proceedUrl: 'https://example.com/app2.git'
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
      }],
      statusPhase: 'Complete'
    }],
    labels: {
      space: 'space2'
    },
    serviceUrls: [{
      environmentName: 'Stage',
      name: 'app2',
      url: 'https://example.com/app2.git'
    }]
  };

  let buildConfig3 = {
    id: 'app3',
    name: 'app3',
    gitUrl: 'https://example.com/app3.git',
    interestingBuilds: [{
      buildNumber: '1',
      firstPendingInputAction: {
        proceedUrl: 'https://example.com/app3.git'
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
    }],
    labels: {
      space: 'space3'
    },
    serviceUrls: [{
      environmentName: 'Run',
      name: 'app3',
      url: 'https://example.com/app3.git'
    }, {
      environmentName: 'Stage',
      name: 'app3',
      url: 'https://example.com/app3.git'
    }]
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

  const testContext = initContext(ApplicatonsListComponent, HostComponent, {
    imports: [
      CommonModule
    ],
    declarations: [
      FakeApplicationsListItemComponent
    ],
    providers: [
      { provide: Contexts, useFactory: () => contexts }
    ]
  }, (component: ApplicatonsListComponent): void => {
    component.buildConfigs = [buildConfig1, buildConfig2, buildConfig3] as any;
  });

  describe('Applications list with build configs', () => {
    it('Build configs should be set', function() {
      expect(testContext.testedDirective.buildConfigs as any[]).toContain(buildConfig1);
      expect(testContext.testedDirective.buildConfigs as any[]).toContain(buildConfig2);
      expect(testContext.testedDirective.buildConfigs as any[]).toContain(buildConfig3);
    });
  });
});
