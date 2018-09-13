import { CommonModule, LocationStrategy } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { BehaviorSubject, never as observableNever,  Observable, of as observableOf } from 'rxjs';
import { initContext, TestContext } from 'testing/test-context';
import { Build } from '../../../../a-runtime-console/index';
import { ApplicationsListItemComponent } from './applications-list-item.component';

@Component({
  selector: 'fabric8-applications-list-item-details',
  template: ''
})
class FakeApplicationsListItemDetailsComponent {
  @Input() build: Build;
}

@Component({
  selector: 'input-action-dialog',
  template: ''
})
class FakeInputActionDialogComponent {
}

@Component({
  template: '<fabric8-applications-list-item></fabric8-applications-list-item>'
})
class HostComponent { }

describe('ApplicationsListItemComponent', () => {
  type TestingContext = TestContext<ApplicationsListItemComponent, HostComponent>;

  let contexts: Contexts;

  let buildConfig = {
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

  let mockRouterEvent: any = {
    'id': 1,
    'url': 'mock-url'
  };

  let mockActivatedRoute: any = jasmine.createSpy('ActivatedRoute');
  let mockLocationStrategy: any = jasmine.createSpyObj('LocationStrategy', ['prepareExternalUrl']);
  let mockRouter = jasmine.createSpyObj('Router', ['createUrlTree', 'navigate', 'serializeUrl']);

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
    mockRouter.events = observableOf(mockRouterEvent);
  });

  initContext(ApplicationsListItemComponent, HostComponent, {
    imports: [
      CommonModule,
      RouterModule
    ],
    declarations: [
      FakeApplicationsListItemDetailsComponent,
      FakeInputActionDialogComponent
    ],
    providers: [
      { provide: ActivatedRoute, useValue: mockActivatedRoute },
      { provide: Contexts, useFactory: () => contexts },
      { provide: LocationStrategy, useValue: mockLocationStrategy },
      { provide: Router, useValue: mockRouter }
    ]
  }, (component: ApplicationsListItemComponent): void => {
    component.buildConfig = buildConfig as any;
  });

  describe('Applications list item with build config', () => {
    it('Build config should be set', function(this: TestingContext) {
      expect(this.testedDirective.buildConfig as any).toEqual(buildConfig);
    });

    it('Expand toggle should be called', function(this: TestingContext) {
      expect(this.testedDirective.expanded).toBeFalsy();
      this.testedDirective.toggleExpanded();
      expect(this.testedDirective.expanded).toBeTruthy();
    });

    it('Should set service URL', function(this: TestingContext) {
      expect(this.testedDirective.applicationUrl).toEqual('https://example.com/app1.git');
    });

    it('Pipeline should be available', function(this: TestingContext) {
      expect(this.testedDirective.pipelineAvailable).toBeTruthy();
    });

    it('Should set build number', function(this: TestingContext) {
      expect(this.testedDirective.promoteBuildInput.build.buildNumber).toEqual('1');
    });

    it('Should set stage name', function(this: TestingContext) {
      expect(this.testedDirective.promoteBuildInput.stage.name).toEqual('Rollout to Run');
    });

    it('Should call proceed', function(this: TestingContext) {
      let mockInputActionDialog: any = jasmine.createSpyObj('InputActionDialog', ['proceed']);

      this.testedDirective.inputActionDialog = mockInputActionDialog;
      this.testedDirective.promoteBuild();
      expect(mockInputActionDialog.proceed).toHaveBeenCalled();
    });
  });
});
