import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  Component,
  DebugElement,
  Input
} from '@angular/core';

import { Observable } from 'rxjs';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { Spaces } from 'ngx-fabric8-wit';

import { DeploymentCardContainerComponent } from './deployment-card-container.component';
import { Environment } from './models/environment';

@Component({
  selector: 'deployment-card',
  template: ''
})
class FakeDeploymentCardComponent {
  @Input() applicationId: string;
  @Input() environment: Environment;
}

describe('DeploymentCardContainer', () => {

  let component: DeploymentCardContainerComponent;
  let fixture: ComponentFixture<DeploymentCardContainerComponent>;
  let mockEnvironments: Observable<Environment[]>;
  let mockEnvironmentData = [
    { environmentId: "id1", name: "envId1"},
    { environmentId: "id2", name: "envId2"}
  ];

  beforeEach(() => {
    mockEnvironments = Observable.of(mockEnvironmentData);

    TestBed.configureTestingModule({
      imports: [ CollapseModule.forRoot() ],
      declarations: [
        DeploymentCardContainerComponent,
        FakeDeploymentCardComponent
      ]
    });

    fixture = TestBed.createComponent(DeploymentCardContainerComponent);
    component = fixture.componentInstance;
    component.environments = mockEnvironments;
    component.application = 'app';

    fixture.detectChanges();
  });

  it('should created children components with proper objects', () => {
    let arrayOfComponents = fixture.debugElement.queryAll(By.directive(FakeDeploymentCardComponent));
    expect(arrayOfComponents.length).toEqual(mockEnvironmentData.length);

    mockEnvironmentData.forEach((envData, index) => {
      let cardComponent = arrayOfComponents[index].componentInstance;
      expect(cardComponent.applicationId).toEqual('app');
      expect(cardComponent.environment).toEqual(mockEnvironmentData[index]);
    });
  });

  it('should set the application title properly', () => {
    let el = fixture.debugElement.query(By.css('#deploymentCardApplicationTitle')).nativeElement;
    expect(el.textContent.trim()).toEqual('app');
  });

});
