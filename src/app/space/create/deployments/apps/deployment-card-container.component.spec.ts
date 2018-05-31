import {
  Component,
  DebugElement,
  DebugNode,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output
} from '@angular/core';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs';

import { Contexts } from 'ngx-fabric8-wit';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { DeploymentCardContainerComponent } from './deployment-card-container.component';

import { DeploymentsService } from '../services/deployments.service';

@Component({
  template: '<deployment-card-container></deployment-card-container>'
})
class HostComponent { }

@Component({
  selector: 'deployment-card',
  template: ''
})
class FakeDeploymentCardComponent {
  @Input() spaceId: string;
  @Input() applicationId: string;
  @Input() environment: string;
  @Input() collapsed: boolean;
  @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
}

describe('DeploymentCardContainer', () => {
  type Context = TestContext<DeploymentCardContainerComponent, HostComponent>;
  const environments: string[] = ['envId1', 'envId2'];
  let mockDeploymentsService: jasmine.SpyObj<DeploymentsService>;
  let mockContexts: any = jasmine.createSpy('Contexts');
  let current = {
    path: 'mock-path',
    user: {
      attributes: {
        username: 'mock-username'
      }
    }
  };
  mockContexts.current = Observable.of(current);

  describe('User has deployed applications', () => {
    mockDeploymentsService = jasmine.createSpyObj('DeploymentsService', ['hasDeployments']);
    mockDeploymentsService.hasDeployments.and.returnValue(Observable.of(true));
    initContext(DeploymentCardContainerComponent, HostComponent,
      {
        declarations: [FakeDeploymentCardComponent],
        providers: [
          { provide: Contexts, useValue: mockContexts },
          { provide: DeploymentsService, useValue: mockDeploymentsService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      },
      (component: DeploymentCardContainerComponent) => {
        component.spaceId = 'space';
        component.environments = Observable.of(environments);
        component.applications = ['app'];
      });

    it('should create child components with proper inputs', function(this: Context) {
      const arrayOfComponents: DebugElement[] =
        this.fixture.debugElement.queryAll(By.directive(FakeDeploymentCardComponent));
      expect(arrayOfComponents.length).toEqual(environments.length);

      environments.forEach((envData: string, index: number) => {
        const cardComponent: DebugNode['componentInstance'] = arrayOfComponents[index].componentInstance;
        expect(cardComponent.applicationId).toEqual('app');
        expect(cardComponent.environment).toEqual(environments[index]);
      });
    });

    it('should set the application title properly', function(this: Context) {
      const el: any = this.fixture.debugElement.query(By.css('#deploymentCardApplicationTitle')).nativeElement;
      expect(el.textContent.trim()).toEqual('app');
    });
  });

  describe('Empty State', () => {
    mockDeploymentsService = jasmine.createSpyObj('DeploymentsService', ['hasDeployments']);
    mockDeploymentsService.hasDeployments.and.returnValue(Observable.of(false));
    initContext(DeploymentCardContainerComponent, HostComponent,
      {
        declarations: [FakeDeploymentCardComponent],
        providers: [
          { provide: Contexts, useValue: mockContexts },
          { provide: DeploymentsService, useValue: mockDeploymentsService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      },
      (component: DeploymentCardContainerComponent) => {
        component.spaceId = 'space';
        component.environments = Observable.of(environments);
        component.applications = ['app'];
      });

    it('should display the empty state template', function(this: Context) {
      const el: any = this.fixture.debugElement.query(By.css('.deployments-empty-state')).nativeElement;
      expect(el).toBeDefined();
    });

    it('should still display the application title properly', function(this: Context) {
      const el: any = this.fixture.debugElement.query(By.css('.not-deployed-application-title')).nativeElement;
      expect(el.textContent.trim()).toEqual('app');
    });
  });
});
