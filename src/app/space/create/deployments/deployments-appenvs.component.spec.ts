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

import { DeploymentsAppEnvsComponent } from './deployments-appenvs.component';
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

describe('DeploymentsAppEnvsComponent', () => {

  let component: DeploymentsAppEnvsComponent;
  let fixture: ComponentFixture<DeploymentsAppEnvsComponent>;
  let mockEnvironments: Observable<Environment[]>;
  let mockApplications: Observable<string[]>;

  beforeEach(() => {
    mockEnvironments = Observable.of([
      { environmentId: "id1", name: "envId1"},
      { environmentId: "id2", name: "envId2"}
    ]);

    mockApplications = Observable.of(['first', 'second']);

    TestBed.configureTestingModule({
      imports: [ CollapseModule.forRoot() ],
      declarations: [
        DeploymentsAppEnvsComponent,
        FakeDeploymentCardComponent
      ]
    });

    fixture = TestBed.createComponent(DeploymentsAppEnvsComponent);
    component = fixture.componentInstance;
    component.environments = mockEnvironments;
    component.applications = mockApplications;

    fixture.detectChanges();
  });

  it('should created children components with proper objects', () => {
    let arrayOfComponents = fixture.debugElement.queryAll(By.directive(FakeDeploymentCardComponent));
    expect(arrayOfComponents.length).toEqual(4);

    let firstCard = arrayOfComponents[0].componentInstance;
    expect(firstCard.applicationId).toEqual('first');
    expect(firstCard.environment.environmentId).toEqual('id1');

    let secondCard = arrayOfComponents[1].componentInstance;
    expect(secondCard.applicationId).toEqual('first');
    expect(secondCard.environment.environmentId).toEqual('id2');

    let thirdCard = arrayOfComponents[2].componentInstance;
    expect(thirdCard.applicationId).toEqual('second');
    expect(thirdCard.environment.environmentId).toEqual('id1');

    let fourthCard = arrayOfComponents[3].componentInstance;
    expect(fourthCard.applicationId).toEqual('second');
    expect(fourthCard.environment.environmentId).toEqual('id2');
  });

});
