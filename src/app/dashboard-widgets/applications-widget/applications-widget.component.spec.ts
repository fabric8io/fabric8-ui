import { CommonModule } from '@angular/common';
import {
  Component,
  Input
} from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { initContext, TestContext } from 'testing/test-context';

import { Context, Contexts } from 'ngx-fabric8-wit';

import { BuildConfig } from '../../../a-runtime-console/index';
import { PipelinesService } from '../../shared/runtime-console/pipelines.service';
import { ApplicationsWidgetComponent } from './applications-widget.component';

@Component({
  selector: 'fabric8-applications-list',
  template: ''
})
class FakeApplicationsListComponent {
  @Input() buildConfigs: BuildConfig[];
}

@Component({
  selector: 'f8-feature-toggle',
  template: ''
})
class FakeFeatureToggleComponent {
  @Input() featureName: string = 'ApplicationsCard';
}

@Component({
  template: '<fabric8-applications-widget></fabric8-applications-widget>'
})
class HostComponent { }

describe('ApplicationsWidgetComponent', () => {
  type TestingContext = TestContext<ApplicationsWidgetComponent, HostComponent>;

  let contexts: Contexts;
  let pipelinesService: { current: Observable<BuildConfig[]> };

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
      recent: Observable.never(),
      default: Observable.never()
    };

    pipelinesService = {
      current: new BehaviorSubject<any[]>([buildConfig1, buildConfig2, buildConfig3])
    };
  });

  initContext(ApplicationsWidgetComponent, HostComponent, {
    imports: [
      CommonModule
    ],
    declarations: [
      FakeApplicationsListComponent,
      FakeFeatureToggleComponent
    ],
    providers: [
      { provide: Contexts, useFactory: () => contexts },
      { provide: PipelinesService, useFactory: () => pipelinesService }
    ]
  });

  describe('Applications widget with build configs', () => {
    it('Build configs should be available', function(this: TestingContext) {
      expect(this.testedDirective.buildConfigsAvailable).toBeTruthy();
    });

    it('Build configs should be set', function(this: TestingContext) {
      expect(this.testedDirective.buildConfigs as any[]).toContain(buildConfig1);
      expect(this.testedDirective.buildConfigs as any[]).toContain(buildConfig2);
      expect(this.testedDirective.buildConfigs as any[]).toContain(buildConfig3);
    });

    it('Stage build configs should be set', function(this: TestingContext) {
      expect(this.testedDirective.stageBuildConfigs as any[]).toContain(buildConfig1);
      expect(this.testedDirective.stageBuildConfigs as any[]).toContain(buildConfig2);
      expect(this.testedDirective.stageBuildConfigs as any[]).toContain(buildConfig3);
    });

    it('Run build configs should be set', function(this: TestingContext) {
      expect(this.testedDirective.runBuildConfigs as any[]).toContain(buildConfig1);
      expect(this.testedDirective.runBuildConfigs as any[]).not.toContain(buildConfig2);
      expect(this.testedDirective.runBuildConfigs as any[]).toContain(buildConfig3);
    });

    it('Stage build configs to be sorted', function(this: TestingContext) {
      expect(this.testedDirective.stageBuildConfigs as any[]).toEqual([buildConfig1, buildConfig3, buildConfig2]);
    });

    it('Run build configs to be sorted', function(this: TestingContext) {
      expect(this.testedDirective.runBuildConfigs as any[]).toEqual([buildConfig1, buildConfig3]);
    });
  });
});
