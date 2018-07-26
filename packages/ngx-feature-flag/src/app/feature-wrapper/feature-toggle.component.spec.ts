import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs';
import { FeatureTogglesService } from '../service/feature-toggles.service';
import { FeatureToggleComponent } from './feature-toggle.component';

describe('FeatureToggleComponent', () => {
  let featureServiceMock: jasmine.SpyObj<FeatureTogglesService>;
  let hostFixture: ComponentFixture<TestHostComponent>;

  @Component({
    selector: `host-component`,
    template: `<f8-feature-toggle featureName="Planner" [userLevel]="user"></f8-feature-toggle><ng-template #user><div>My content here</div></ng-template>`
  })
  class TestHostComponent {
  }
  beforeEach(() => {
    featureServiceMock = jasmine.createSpyObj('FeatureTogglesService', ['isFeatureUserEnabled']);

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [FeatureToggleComponent, TestHostComponent],
      providers: [
        {
          provide: FeatureTogglesService, useValue: featureServiceMock
        }
      ]
    });

    hostFixture = TestBed.createComponent(TestHostComponent);
  });

  it('should render content if feature is user enabled', async(() => {
    // given
    featureServiceMock.isFeatureUserEnabled.and.returnValue(Observable.of(true));
    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('div').innerText).toEqual('My content here');
    });
  }));

  it('should not render content if feature is not user enabled', async(() => {
    // given
    featureServiceMock.isFeatureUserEnabled.and.returnValue(Observable.of(false));
    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('div')).toBeNull();
    });
  }));
});
