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

import { DeploymentCardContainerComponent } from './deployment-card-container.component';
import { Environment } from './models/environment';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { Spaces } from 'ngx-fabric8-wit';

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

  beforeEach(() => {
    mockEnvironments = Observable.of([
      { environmentId: "id1", name: "envId1"},
      { environmentId: "id2", name: "envId2"}
    ]);

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
    expect(arrayOfComponents.length).toEqual(2);
    expect(arrayOfComponents[0].componentInstance.applicationId).toEqual('app');
    expect(arrayOfComponents[0].componentInstance.environment).toEqual({ environmentId: "id1", name: "envId1"});
    expect(arrayOfComponents[1].componentInstance.applicationId).toEqual('app');
    expect(arrayOfComponents[1].componentInstance.environment).toEqual({ environmentId: "id2", name: "envId2"});
  });

  it('should set the application title properly', () => {
    let el = fixture.debugElement.query(By.css('#deploymentCardApplicationTitle')).nativeElement;
    expect(el.textContent.trim()).toEqual('app');
  });

});
