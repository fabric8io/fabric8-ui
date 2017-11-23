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

import { DeploymentsResourceUsageComponent } from './deployments-resource-usage.component';
import { Environment } from './models/environment';
import { Stat } from './models/stat';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { Spaces } from 'ngx-fabric8-wit';

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
  let spaceIdObservable = Observable.of('spaceId');

  beforeEach(() => {
    mockEnvironments = Observable.of([
      { environmentId: "id1", name: "envId1"},
      { environmentId: "id2", name: "envId2"}
    ]);

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
    expect(arrayOfComponents.length).toEqual(2);

    let firstCardComponent = arrayOfComponents[0].componentInstance;
    expect(firstCardComponent.environmentId).toEqual("id1");
    expect(firstCardComponent.spaceId).toEqual('spaceId');

    let secondCardComponent = arrayOfComponents[1].componentInstance;
    expect(secondCardComponent.environmentId).toEqual("id2");
    expect(secondCardComponent.spaceId).toEqual('spaceId');
  });

});
