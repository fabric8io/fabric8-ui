import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { of } from 'rxjs';
import { initContext } from 'testing/test-context';
import { DeploymentsResourceUsageComponent } from './deployments-resource-usage.component';

@Component({
  template: '<deployments-resource-usage></deployments-resource-usage>',
})
class HostComponent {}

@Component({
  selector: 'resource-card',
  template: '',
})
class FakeResourceCardComponent {
  @Input() spaceId: string;
  @Input() environment: string;
}

describe('DeploymentsResourceUsageComponent', () => {
  const mockEnvironmentData: string[] = ['envId1', 'envId2'];

  const testContext = initContext(
    DeploymentsResourceUsageComponent,
    HostComponent,
    {
      imports: [CollapseModule.forRoot()],
      declarations: [FakeResourceCardComponent],
    },
    (component: DeploymentsResourceUsageComponent): void => {
      component.environments = of(mockEnvironmentData);
      component.spaceId = of('spaceId');
    },
  );

  it('should create children components with proper environment objects', (): void => {
    const arrayOfComponents: DebugElement[] = testContext.fixture.debugElement.queryAll(
      By.directive(FakeResourceCardComponent),
    );
    expect(arrayOfComponents.length).toEqual(mockEnvironmentData.length);

    mockEnvironmentData.forEach(
      (envData: string, index: number): void => {
        const cardComponent: FakeResourceCardComponent = arrayOfComponents[index].componentInstance;
        expect(cardComponent.environment).toEqual(mockEnvironmentData[index]);
        expect(cardComponent.spaceId).toEqual('spaceId');
      },
    );
  });
});
