import {
  Component,
  DebugElement,
  Input,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Broadcaster } from 'ngx-base';
import { FilterEvent } from 'patternfly-ng/filter';
import { Observable ,  of } from 'rxjs';
import { initContext } from 'testing/test-context';
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

describe('DeploymentsAppsComponent', (): void => {

  const environments: string[] = ['envId1', 'envId2'];
  const applications: string[] = ['first', 'second'];
  const mockEnvironments: Observable<string[]> = of(environments);
  const mockApplications: Observable<string[]> = of(applications);

  const testContext = initContext(DeploymentsAppsComponent, HostComponent,
    {
      declarations: [FakeDeploymentCardContainerComponent],
      providers: [
        { provide: Broadcaster, useValue: jasmine.createSpyObj('Broadcaster', ['broadcast']) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    },
    (component: DeploymentsAppsComponent): void => {
      component.spaceId = of('spaceId');
      component.spaceName = of('spaceName');
      component.environments = mockEnvironments;
      component.applications = mockApplications;
    });

  it('should create a single container to hold application and environment cards', (): void => {
    const arrayOfComponents: DebugElement[] =
      testContext.fixture.debugElement.queryAll(By.directive(FakeDeploymentCardContainerComponent));
    expect(arrayOfComponents.length).toEqual(1);

    expect(arrayOfComponents[0].componentInstance.applications).toEqual(applications);
    expect(arrayOfComponents[0].componentInstance.environments).toEqual(mockEnvironments);
  });

  describe('#showAddAppOverlay', () => {
    it('should delegate to Broadcaster to display the launcher', (): void => {
      testContext.testedDirective.showAddAppOverlay();
      expect(TestBed.get(Broadcaster).broadcast).toHaveBeenCalledWith('showAddAppOverlay', true);
    });
  });

  describe('#filterApplications', () => {
    it('should supply filtered applications list to deployment card container', (): void => {
      const filter: FilterEvent = {
        appliedFilters: [{
          field: {
            id: 'applicationId',
            placeholder: 'Filter by Application Name...',
            title: 'Application Name',
            type: 'text'
          },
          value: 'abc'
        }]
      };
      testContext.testedDirective.filterChange(filter);
      testContext.fixture.detectChanges();


      const arrayOfComponents: DebugElement[] =
      testContext.fixture.debugElement.queryAll(By.directive(FakeDeploymentCardContainerComponent));
      expect(arrayOfComponents.length).toEqual(1);

      expect(arrayOfComponents[0].componentInstance.applications).toEqual([]);
    });
  });

});
