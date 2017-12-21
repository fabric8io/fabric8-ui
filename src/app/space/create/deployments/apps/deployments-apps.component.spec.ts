import {
  initContext,
  TestContext
} from 'testing/test-context';

import { By } from '@angular/platform-browser';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  FilterEvent,
  SortEvent
} from 'patternfly-ng'

import { Observable } from 'rxjs';

import { DeploymentsAppsComponent } from './deployments-apps.component';
import { Environment } from '../models/environment';

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
  @Input() environments: Observable<Environment[]>;
  @Input() application: string;
}

@Component({
  selector: 'deployments-toolbar',
  template: ''
})
class FakeDeploymentsToolbarComponent {
  @Output('onFilterChange') public onFilterChange: EventEmitter<FilterEvent> = new EventEmitter<FilterEvent>();
  @Output('onSortChange') public onSortChange: EventEmitter<SortEvent> = new EventEmitter<SortEvent>();
  @Input() public resultsCount: number;
}

describe('DeploymentsAppsComponent', () => {
  type Context = TestContext<DeploymentsAppsComponent, HostComponent>;

  let environments = [ { name: 'envId1' }, { name: 'envId2' } ];
  let applications = ['first', 'second'];
  let spaceId = Observable.of('spaceId');
  let mockEnvironments = Observable.of(environments);
  let mockApplications = Observable.of(applications);

  initContext(DeploymentsAppsComponent, HostComponent,
    { declarations: [FakeDeploymentCardContainerComponent, FakeDeploymentsToolbarComponent] },
    component => {
      component.spaceId = spaceId;
      component.environments = mockEnvironments;
      component.applications = mockApplications;
    });

  it('should created children components with proper objects', function (this: Context) {
    let arrayOfComponents = this.fixture.debugElement.queryAll(By.directive(FakeDeploymentCardContainerComponent));
    expect(arrayOfComponents.length).toEqual(applications.length);

    applications.forEach((appName, index) => {
      let container = arrayOfComponents[index].componentInstance;
      expect(container.application).toEqual(appName);
      expect(container.environments).toEqual(mockEnvironments);
    });
  });

});
