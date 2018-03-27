import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { By } from '@angular/platform-browser';

import { FilterEvent } from 'patternfly-ng/filter';
import { SortEvent } from 'patternfly-ng/sort';
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
  @Input() environments: Observable<string[]>;
  @Input() application: string;
}

@Component({
  selector: 'deployments-toolbar',
  template: ''
})
class FakeDeploymentsToolbarComponent {
  @Output('onFilterChange') onFilterChange: EventEmitter<FilterEvent> = new EventEmitter<FilterEvent>();
  @Output('onSortChange') onSortChange: EventEmitter<SortEvent> = new EventEmitter<SortEvent>();
  @Input() resultsCount: number;
}

describe('DeploymentsAppsComponent', () => {
  type Context = TestContext<DeploymentsAppsComponent, HostComponent>;

  const environments: string[] = ['envId1', 'envId2'];
  const applications: string[] = ['first', 'second'];
  const spaceId: Observable<string> = Observable.of('spaceId');
  const mockEnvironments: Observable<string[]> = Observable.of(environments);
  const mockApplications: Observable<string[]> = Observable.of(applications);

  initContext(DeploymentsAppsComponent, HostComponent,
    {
      declarations: [FakeDeploymentCardContainerComponent, FakeDeploymentsToolbarComponent]
    },
    (component: DeploymentsAppsComponent) => {
      component.spaceId = spaceId;
      component.environments = mockEnvironments;
      component.applications = mockApplications;
    });

  it('should created children components with proper objects', function(this: Context) {
    const arrayOfComponents: DebugElement[] =
      this.fixture.debugElement.queryAll(By.directive(FakeDeploymentCardContainerComponent));
    expect(arrayOfComponents.length).toEqual(applications.length);

    applications.forEach((appName: string, index: number) => {
      const container = arrayOfComponents[index].componentInstance;
      expect(container.application).toEqual(appName);
      expect(container.environments).toEqual(mockEnvironments);
    });
  });

});
