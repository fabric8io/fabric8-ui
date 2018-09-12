import {
  Component,
  DebugElement,
  Input
} from '@angular/core';
import { By } from '@angular/platform-browser';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { of } from 'rxjs/observable/of';
import { initContext, TestContext } from 'testing/test-context';

import { DeploymentsResourceUsageComponent } from './deployments-resource-usage.component';

@Component({
  template: '<deployments-resource-usage></deployments-resource-usage>'
})
class HostComponent { }

@Component({
  selector: 'resource-card',
  template: ''
})
class FakeResourceCardComponent {
  @Input() spaceId: string;
  @Input() environment: string;
}

describe('DeploymentsResourceUsageComponent', () => {
  type Context = TestContext<DeploymentsResourceUsageComponent, HostComponent>;

  const mockEnvironmentData: string[] = ['envId1', 'envId2'];

  initContext(DeploymentsResourceUsageComponent, HostComponent,
    {
      imports: [CollapseModule.forRoot()],
      declarations: [FakeResourceCardComponent]
    },
    (component: DeploymentsResourceUsageComponent) => {
      component.environments = of(mockEnvironmentData);
      component.spaceId = of('spaceId');
    }
  );

  it('should create children components with proper environment objects', function(this: Context) {
    let arrayOfComponents: DebugElement[] =
      this.fixture.debugElement.queryAll(By.directive(FakeResourceCardComponent));
    expect(arrayOfComponents.length).toEqual(mockEnvironmentData.length);

    mockEnvironmentData.forEach((envData: string, index: number) => {
      let cardComponent: FakeResourceCardComponent = arrayOfComponents[index].componentInstance;
      expect(cardComponent.environment).toEqual(mockEnvironmentData[index]);
      expect(cardComponent.spaceId).toEqual('spaceId');
    });
  });

});
