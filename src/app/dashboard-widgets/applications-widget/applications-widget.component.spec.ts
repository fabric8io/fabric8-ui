import { CommonModule, LocationStrategy } from '@angular/common';
import {
  Component,
  Input
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { ConnectableObservable, Subject } from 'rxjs/Rx';

import { Context, Contexts } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';

import { createMock } from 'testing/mock';
import { initContext, TestContext } from 'testing/test-context';

import { BuildConfig } from '../../../a-runtime-console/index';
import { LoadingWidgetModule } from '../../dashboard-widgets/loading-widget/loading-widget.module';
import { PipelinesService } from '../../shared/runtime-console/pipelines.service';
import { ApplicationsWidgetComponent } from './applications-widget.component';

import { FeatureToggleComponent } from '../../feature-flag/feature-wrapper/feature-toggle.component';
import { Feature, FeatureTogglesService } from '../../feature-flag/service/feature-toggles.service';

@Component({
  selector: 'fabric8-applications-list',
  template: ''
})
class FakeApplicationsListComponent {
  @Input() buildConfigs: BuildConfig[];
}

@Component({
  template: '<fabric8-applications-widget [userOwnsSpace]="userOwnsSpace"></fabric8-applications-widget>'
})
class HostComponent {
  userOwnsSpace: boolean;
}

describe('ApplicationsWidgetComponent', () => {
  type TestingContext = TestContext<ApplicationsWidgetComponent, HostComponent>;

  let contexts: Contexts;
  let pipelinesService: { current: Observable<BuildConfig[]> };

  let fakeUser: Observable<User> = Observable.of({
    id: 'fakeId',
    type: 'fakeType',
    attributes: {
      fullName: 'fakeName',
      imageURL: 'null',
      username: 'fakeUserName'
    }
  } as User);

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

  let ctxSubj: Subject<Context> = new Subject<Context>();

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
      CommonModule,
      LoadingWidgetModule,
      RouterModule
    ],
    declarations: [
      FakeApplicationsListComponent,
      FeatureToggleComponent
    ],
    providers: [
      { provide: ActivatedRoute, useValue: jasmine.createSpy('ActivatedRoute') },
      { provide: Contexts, useValue: ({ current: ctxSubj }) },
      { provide: LocationStrategy, useValue: jasmine.createSpyObj('LocationStrategy', ['prepareExternalUrl']) },
      { provide: PipelinesService, useFactory: () => pipelinesService },
      {
        provide: FeatureTogglesService, useFactory: () => {
          let mock = createMock(FeatureTogglesService);
          mock.getFeature.and.returnValue(Observable.of({
            attributes: { enabled: true, 'user-enabled': true }
          } as Feature));

          return mock;
        }
      },
      {
        provide: Router, useFactory: (): jasmine.SpyObj<Router> => {
          let mockRouterEvent: any = {
            'id': 1,
            'url': 'mock-url'
          };

          let mockRouter = jasmine.createSpyObj('Router', ['createUrlTree', 'navigate', 'serializeUrl']);
          mockRouter.events = Observable.of(mockRouterEvent);

          return mockRouter;
        }
      },
      {
        provide: UserService, useFactory: () => {
          let userService = createMock(UserService);
          userService.getUser.and.returnValue(fakeUser);
          userService.loggedInUser = fakeUser.publish() as ConnectableObservable<User> & jasmine.Spy;
          return userService;
        }
      }
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

    it('Empty build configs to not show empty state', function(this: TestingContext) {
      this.hostComponent.userOwnsSpace = true;
      this.detectChanges();
      expect(this.fixture.debugElement.query(By.css('#spacehome-applications-add-button'))).toBeNull();
    });

    it('Empty build configs to show empty state', function(this: TestingContext) {
      this.hostComponent.userOwnsSpace = true;
      this.testedDirective.buildConfigs.length = 0;
      this.detectChanges();
      expect(this.fixture.debugElement.query(By.css('#spacehome-applications-add-button'))).not.toBeNull();
    });

    it('Empty stage and run build configs to show empty state', function(this: TestingContext) {
      this.testedDirective.runBuildConfigs.length = 0;
      this.testedDirective.stageBuildConfigs.length = 0;
      this.detectChanges();
      expect(this.fixture.debugElement.query(By.css('#spacehome-applications-pipelines-link'))).not.toBeNull();
    });

    it('Stage or run build configs not to show empty state', function(this: TestingContext) {
      expect(this.fixture.debugElement.query(By.css('#spacehome-applications-pipelines-link'))).toBeNull();
    });
  });

  describe('Applications widget without build configs', () => {

    it('should enable buttons if the user owns the space', function(this: TestingContext) {
      this.hostComponent.userOwnsSpace = true;
      this.testedDirective.buildConfigs.length = 0;
      this.detectChanges();

      expect(this.fixture.debugElement.query(By.css('#spacehome-applications-add-button'))).not.toBeNull();
    });

    it('should disable buttons if the user does not own the space', function(this: TestingContext) {
      this.hostComponent.userOwnsSpace = false;
      this.testedDirective.buildConfigs.length = 0;
      this.detectChanges();

      expect(this.fixture.debugElement.query(By.css('#spacehome-applications-add-button'))).toBeNull();
    });
  });
});
