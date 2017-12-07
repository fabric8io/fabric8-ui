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

import { DeploymentsAppsComponent } from './deployments-appenvs.component';
import { Environment } from '../models/environment';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { Spaces } from 'ngx-fabric8-wit';

@Component({
  selector: 'deployment-card-container',
  template: ''
})
class FakeDeploymentCardContainerComponent {
  @Input() environments: Observable<Environment[]>;
  @Input() application: string;
}

describe('DeploymentsAppEnvsComponent', () => {

  let component: DeploymentsAppsComponent;
  let fixture: ComponentFixture<DeploymentsAppsComponent>;
  let mockApplicationData = ['first', 'second'];
  let mockApplications = Observable.of(mockApplicationData);
  let mockEnvironments = Observable.of([
    { environmentId: "id1", name: "envId1"},
    { environmentId: "id2", name: "envId2"}
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ CollapseModule.forRoot() ],
      declarations: [
        DeploymentsAppsComponent,
        FakeDeploymentCardContainerComponent
      ]
    });

    fixture = TestBed.createComponent(DeploymentsAppsComponent);
    component = fixture.componentInstance;
    component.environments = mockEnvironments;
    component.applications = mockApplications;

    fixture.detectChanges();
  });

  it('should created children components with proper objects', () => {
    let arrayOfComponents = fixture.debugElement.queryAll(By.directive(FakeDeploymentCardContainerComponent));
    expect(arrayOfComponents.length).toEqual(mockApplicationData.length);

    mockApplicationData.forEach((appName, index) => {
      let container = arrayOfComponents[index].componentInstance;
      expect(container.application).toEqual(appName);
      expect(container.environments).toEqual(mockEnvironments);
    });
  });

});
