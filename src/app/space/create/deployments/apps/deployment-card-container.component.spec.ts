import {
  Component,
  DebugElement,
  DebugNode,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Contexts } from 'ngx-fabric8-wit';
import { BehaviorSubject, of } from 'rxjs';
import { createMock } from 'testing/mock';
import { initContext } from 'testing/test-context';
import { DeploymentsService } from '../services/deployments.service';
import { DeploymentCardContainerComponent } from './deployment-card-container.component';

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
  const environments: string[] = ['envId1', 'envId2'];

  const testContext = initContext(DeploymentCardContainerComponent, HostComponent,
    {
      declarations: [FakeDeploymentCardComponent],
      providers: [
        {
          provide: Contexts, useValue: {
            current: of({
              path: 'mock-path',
              user: {
                attributes: {
                  username: 'mock-username'
                }
              }
            })
          }
        },
        {
          provide: DeploymentsService, useFactory: (): jasmine.SpyObj<DeploymentsService> => {
            const svc: jasmine.SpyObj<DeploymentsService> = createMock(DeploymentsService);
            svc.hasDeployments.and.returnValue(new BehaviorSubject<boolean>(true));
            return svc;
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    },
    (component: DeploymentCardContainerComponent): void => {
      component.spaceId = 'space';
      component.environments = of(environments);
      component.applications = ['app'];
    });

  describe('User has deployed applications', (): void => {
    it('should create child components with proper inputs', (): void => {
      const arrayOfComponents: DebugElement[] =
        testContext.fixture.debugElement.queryAll(By.directive(FakeDeploymentCardComponent));
      expect(arrayOfComponents.length).toEqual(environments.length);

      environments.forEach((envData: string, index: number): void => {
        const cardComponent: DebugNode['componentInstance'] = arrayOfComponents[index].componentInstance;
        expect(cardComponent.applicationId).toEqual('app');
        expect(cardComponent.environment).toEqual(environments[index]);
      });
    });

    it('should set the application title properly', (): void => {
      const el: HTMLElement = testContext.fixture.debugElement.query(By.css('#deploymentCardApplicationTitle')).nativeElement;
      expect(el.textContent.trim()).toEqual('app');
    });
  });

  describe('Empty State', (): void => {
    beforeEach((): void => {
      TestBed.get(DeploymentsService).hasDeployments().next(false);
      testContext.detectChanges();
    });

    it('should display the empty state template', (): void => {
      const el: HTMLElement = testContext.fixture.debugElement.query(By.css('.deployments-empty-state')).nativeElement;
      expect(el).toBeDefined();
    });

    it('should still display the application title properly', (): void => {
      const el: HTMLElement = testContext.fixture.debugElement.query(By.css('.not-deployed-application-title')).nativeElement;
      expect(el.textContent.trim()).toEqual('app');
    });
  });
});
