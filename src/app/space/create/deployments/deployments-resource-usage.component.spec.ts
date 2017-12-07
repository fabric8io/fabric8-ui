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

import { DeploymentsResourceUsageComponent } from './deployments-resource-usage.component';
import { Environment } from './models/environment';
import { Stat } from './models/stat';

@Component({
  selector: 'resource-card',
  template: ''
})
class FakeResourceCardComponent {
  @Input() spaceId: string;
  @Input() environmentId: string;
}

describe('DeploymentsResourceUsageComponent', () => {

  let component: DeploymentsResourceUsageComponent;
  let fixture: ComponentFixture<DeploymentsResourceUsageComponent>;
  let mockEnvironments: Observable<Environment[]>;
  let mockEnvironmentData = [
    { environmentId: "id1", name: "envId1"},
    { environmentId: "id2", name: "envId2"}
  ];
  let spaceIdObservable = Observable.of('spaceId');

  beforeEach(() => {
    mockEnvironments = Observable.of(mockEnvironmentData);

    TestBed.configureTestingModule({
      imports: [ CollapseModule.forRoot() ],
      declarations: [ DeploymentsResourceUsageComponent, FakeResourceCardComponent ],
    });

    fixture = TestBed.createComponent(DeploymentsResourceUsageComponent);
    component = fixture.componentInstance;
    component.environments = mockEnvironments;
    component.spaceId = spaceIdObservable;

    fixture.detectChanges();
  });

  it('should create children components with proper environment objects', () => {
    let arrayOfComponents = fixture.debugElement.queryAll(By.directive(FakeResourceCardComponent));
    expect(arrayOfComponents.length).toEqual(mockEnvironmentData.length);

    mockEnvironmentData.forEach((envData, index) => {
      let cardComponent = arrayOfComponents[index].componentInstance;
      expect(cardComponent.environmentId).toEqual(mockEnvironmentData[index].environmentId);
      expect(cardComponent.spaceId).toEqual('spaceId');
    });
  });

});
