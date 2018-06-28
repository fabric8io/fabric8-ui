import {
  Component,
  DebugElement,
  Input,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Broadcaster } from 'ngx-base';
import { Observable } from 'rxjs';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { DeploymentsAppsComponent } from './deployments-apps.component';

@Component({
  template: '<deployments-apps></deployments-apps>'
})
class HostComponent { }

@Component({
  selector: 'deployment-card-container',
  template: ''
})
class FakeDeploymentCardContainerComponent {
  @Input() spaceId: string;
  @Input() spaceName: string;
  @Input() applications: string[];
  @Input() environments: Observable<string[]>;
}

describe('DeploymentsAppsComponent', () => {
  type Context = TestContext<DeploymentsAppsComponent, HostComponent>;

  const environments: string[] = ['envId1', 'envId2'];
  const applications: string[] = ['first', 'second'];
  const mockEnvironments: Observable<string[]> = Observable.of(environments);
  const mockApplications: Observable<string[]> = Observable.of(applications);

  initContext(DeploymentsAppsComponent, HostComponent,
    {
      declarations: [FakeDeploymentCardContainerComponent],
      providers: [
        { provide: Broadcaster, useValue: jasmine.createSpyObj('Broadcaster', ['broadcast']) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    },
    (component: DeploymentsAppsComponent) => {
      component.spaceId = Observable.of('spaceId');
      component.spaceName = Observable.of('spaceName');
      component.environments = mockEnvironments;
      component.applications = mockApplications;
    });

  it('should create a single container to hold application and environment cards', function(this: Context) {
    const arrayOfComponents: DebugElement[] =
      this.fixture.debugElement.queryAll(By.directive(FakeDeploymentCardContainerComponent));
    expect(arrayOfComponents.length).toEqual(1);

    expect(arrayOfComponents[0].componentInstance.applications).toEqual(applications);
    expect(arrayOfComponents[0].componentInstance.environments).toEqual(mockEnvironments);
  });

  describe('#showAddAppOverlay', () => {
    it('should delegate to Broadcaster to display the launcher', function(this: Context) {
      this.testedDirective.showAddAppOverlay();
      expect(TestBed.get(Broadcaster).broadcast).toHaveBeenCalledWith('showAddAppOverlay', true);
    });
  });

});
