import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output
} from '@angular/core';
import { By } from '@angular/platform-browser';

import { Broadcaster } from 'ngx-base';
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
  @Input() spaceName: string;
  @Input() applications: string[];
  @Input() environments: Observable<string[]>;
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
  let mockBroadcaster: jasmine.SpyObj<Broadcaster> = jasmine.createSpyObj('Broadcaster', ['broadcast']);

  type Context = TestContext<DeploymentsAppsComponent, HostComponent>;

  const environments: string[] = ['envId1', 'envId2'];
  const applications: string[] = ['first', 'second'];
  const spaceId: Observable<string> = Observable.of('spaceId');
  const spaceName: Observable<string> = Observable.of('spaceName');
  const mockEnvironments: Observable<string[]> = Observable.of(environments);
  const mockApplications: Observable<string[]> = Observable.of(applications);

  initContext(DeploymentsAppsComponent, HostComponent,
    {
      declarations: [FakeDeploymentCardContainerComponent, FakeDeploymentsToolbarComponent],
      providers: [
        { provide: Broadcaster, useValue: mockBroadcaster }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    },
    (component: DeploymentsAppsComponent) => {
      component.spaceId = spaceId;
      component.spaceName = spaceName;
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
      expect(mockBroadcaster.broadcast).toHaveBeenCalledWith('showAddAppOverlay', true);
    });
  });

});
