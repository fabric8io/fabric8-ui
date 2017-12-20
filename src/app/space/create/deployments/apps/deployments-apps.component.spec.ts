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

import { DeploymentsAppsComponent } from './deployments-apps.component';
import { Environment } from '../models/environment';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { Spaces } from 'ngx-fabric8-wit';

@Component({
  selector: 'deployment-card-container',
  template: ''
})
class FakeDeploymentCardContainerComponent {
  @Input() spaceId: string;
  @Input() environments: Observable<Environment[]>;
  @Input() application: string;
}

describe('DeploymentsAppsComponent', () => {

  let component: DeploymentsAppsComponent;
  let fixture: ComponentFixture<DeploymentsAppsComponent>;
  let mockApplicationData = ['first', 'second'];
  let mockApplications = Observable.of(mockApplicationData);
  let mockEnvironments = Observable.of([
    { name: 'envId1'} as Environment,
    { name: 'envId2'} as Environment
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
