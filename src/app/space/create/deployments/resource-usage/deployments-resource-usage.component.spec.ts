import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { Observable } from 'rxjs';
import { initContext, TestContext } from 'testing/test-context';

import { Environment } from '../models/environment';
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
  @Input() environment: Environment;
}

describe('DeploymentsResourceUsageComponent', () => {
  type Context = TestContext<DeploymentsResourceUsageComponent, HostComponent>;

  let spaceIdObservable = Observable.of('spaceId');
  let mockEnvironmentData = [
    { name: 'envId1'} as Environment,
    { name: 'envId2'} as Environment
  ];
  let mockEnvironments = Observable.of(mockEnvironmentData);

  initContext(DeploymentsResourceUsageComponent, HostComponent,
    {
      imports: [CollapseModule.forRoot()],
      declarations: [FakeResourceCardComponent]
    },
    component => {
      component.environments = mockEnvironments;
      component.spaceId = spaceIdObservable;
    });

  it('should create children components with proper environment objects', function(this: Context) {
    let arrayOfComponents = this.fixture.debugElement.queryAll(By.directive(FakeResourceCardComponent));
    expect(arrayOfComponents.length).toEqual(mockEnvironmentData.length);

    mockEnvironmentData.forEach((envData, index) => {
      let cardComponent = arrayOfComponents[index].componentInstance;
      expect(cardComponent.environment).toEqual(mockEnvironmentData[index]);
      expect(cardComponent.spaceId).toEqual('spaceId');
    });
  });

});
