import { ComponentFixture } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import {
  Component,
  Input
} from '@angular/core';

import { createMock } from '../../../../testing/mock';

import { Observable } from 'rxjs';

import {
  initContext,
  TestContext
} from '../../../../testing/test-context';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { DeploymentsComponent } from './deployments.component';
import { DeploymentsService } from './services/deployments.service';
import { Environment } from './models/environment';

import { Spaces } from 'ngx-fabric8-wit';

@Component({
  selector: 'deployments-resource-usage',
  template: ''
})

class FakeDeploymentsResourceUsageComponent {
  @Input() environments: Observable<Environment[]>;
}

@Component({
  selector: 'deployments-apps',
  template: ''
})
class FakeDeploymentAppsComponent {
  @Input() spaceId: Observable<string>;
  @Input() environments: Observable<Environment[]>;
  @Input() applications: Observable<string[]>;
}

@Component({
  template: '<alm-apps></alm-apps>'
})
class HostComponent { }

describe('DeploymentsComponent', () => {
  type Context = TestContext<DeploymentsComponent, HostComponent>;

  let component: DeploymentsComponent;
  let fixture: ComponentFixture<DeploymentsComponent>;

  let mockSvc: jasmine.SpyObj<DeploymentsService>;
  let spaces = { current: Observable.of({ id: 'fake-spaceId' }) };
  let mockApplications = Observable.of(['foo-app', 'bar-app']);
  let mockEnvironments = Observable.of([
    { name: 'stage' } as Environment,
    { name: 'prod' } as Environment
  ]);

  beforeAll(() => {
    mockSvc = createMock(DeploymentsService);
    mockSvc.getApplications.and.returnValue(mockApplications);
    mockSvc.getEnvironments.and.returnValue(mockEnvironments);
  });

  initContext(DeploymentsComponent, HostComponent, {
    imports: [CollapseModule.forRoot()],
    declarations: [
      FakeDeploymentAppsComponent,
      FakeDeploymentsResourceUsageComponent
    ],
    providers: [
      { provide: DeploymentsService, useFactory: () => mockSvc },
      { provide: Spaces, useValue: spaces }
    ]
  });

  it('should set service result to applications property', function(this: Context, done: DoneFn) {
    expect(mockSvc.getApplications).toHaveBeenCalledWith('fake-spaceId');
    this.testedDirective.applications.subscribe(applications => {
      expect(applications).toEqual(['foo-app', 'bar-app']);
      done();
    });
  });

  it('should set service result to environments property', function(this: Context, done: DoneFn) {
    expect(mockSvc.getEnvironments).toHaveBeenCalledWith('fake-spaceId');
    this.testedDirective.environments.subscribe(environments => {
      expect(environments).toEqual([
        { name: 'stage' } as Environment,
        { name: 'prod' } as Environment
      ]);
      done();
    });
  });

  it('should pass values to children resource usage components', function(this: Context) {
    let resourceUsageComponents = this.tested.queryAll(By.directive(FakeDeploymentsResourceUsageComponent));
    expect(resourceUsageComponents.length).toEqual(1);
    let resourceUsageComponent = resourceUsageComponents[0].componentInstance;
    expect(resourceUsageComponent.environments).toBe(mockEnvironments);

    let appsComponents = this.tested.queryAll(By.directive(FakeDeploymentAppsComponent));
    expect(appsComponents.length).toEqual(1);
    let appsComponent = appsComponents[0].componentInstance;
    expect(appsComponent.environments).toBe(mockEnvironments);
    expect(appsComponent.applications).toBe(mockApplications);
  });

});
