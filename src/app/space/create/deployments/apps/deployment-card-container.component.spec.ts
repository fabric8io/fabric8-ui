import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs';
import { initContext, TestContext } from 'testing/test-context';


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

  const environments = [
    { name: 'envId1' },
    { name: 'envId2' }
  ];

  initContext(DeploymentCardContainerComponent, HostComponent, { declarations: [FakeDeploymentCardComponent] },
    component => {
      component.spaceId = 'space';
      component.environments = Observable.of(environments);
      component.application = 'app';
    });

  it('should created children components with proper objects', function(this: Context) {
    let arrayOfComponents = this.fixture.debugElement.queryAll(By.directive(FakeDeploymentCardComponent));
    expect(arrayOfComponents.length).toEqual(environments.length);

    environments.forEach((envData, index) => {
      let cardComponent = arrayOfComponents[index].componentInstance;
      expect(cardComponent.applicationId).toEqual('app');
      expect(cardComponent.environment).toEqual(environments[index]);
    });
  });

  it('should set the application title properly', function(this: Context) {
    let el = this.fixture.debugElement.query(By.css('#deploymentCardApplicationTitle')).nativeElement;
    expect(el.textContent.trim()).toEqual('app');
  });

});
