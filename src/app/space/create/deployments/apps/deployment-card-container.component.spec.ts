import {
  Component,
  DebugElement,
  Input
} from '@angular/core';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs';

import {
  initContext,
  TestContext
} from 'testing/test-context';

import { Environment } from '../models/environment';

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
  @Input() environment: Environment;
}

describe('DeploymentCardContainer', () => {
  type Context = TestContext<DeploymentCardContainerComponent, HostComponent>;

  const environments: Environment[] = [
    { name: 'envId1' },
    { name: 'envId2' }
  ];

  initContext(DeploymentCardContainerComponent, HostComponent,
    {
      declarations: [FakeDeploymentCardComponent]
    },
    (component: DeploymentCardContainerComponent) => {
      component.spaceId = 'space';
      component.environments = Observable.of(environments);
      component.application = 'app';
    });

  it('should create child components with proper inputs', function(this: Context) {
    const arrayOfComponents: DebugElement[] =
      this.fixture.debugElement.queryAll(By.directive(FakeDeploymentCardComponent));
    expect(arrayOfComponents.length).toEqual(environments.length);

    environments.forEach((envData: Environment, index: number) => {
      const cardComponent = arrayOfComponents[index].componentInstance;
      expect(cardComponent.applicationId).toEqual('app');
      expect(cardComponent.environment).toEqual(environments[index]);
    });
  });

  it('should set the application title properly', function(this: Context) {
    const el: any = this.fixture.debugElement.query(By.css('#deploymentCardApplicationTitle')).nativeElement;
    expect(el.textContent.trim()).toEqual('app');
  });

});
