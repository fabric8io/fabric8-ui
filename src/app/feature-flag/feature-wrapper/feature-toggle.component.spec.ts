import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs';
import { Feature, FeatureTogglesService } from '../service/feature-toggles.service';
import { FeatureToggleComponent } from './feature-toggle.component';

describe('FeatureToggleComponent', () => {
  let featureServiceMock: any;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  let feature: Feature = {
    attributes: {
      name: 'Planner',
      description: 'Description',
      enabled: true,
      'enablement-level': 'beta',
      'user-enabled': true
    },
    id: 'Planner'
  };

  @Component({
    selector: `host-component`,
    template: `<f8-feature-toggle featureName="Planner"><div user-level>My content here</div></f8-feature-toggle>`
  })
  class TestHostComponent {
  }
  beforeEach(() => {
    featureServiceMock = jasmine.createSpyObj('FeatureTogglesService', ['getFeature']);

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
    hostComponent = hostFixture.componentInstance;
  });

  it('should render content if toggles is on and user-enabled on', async(() => {
    // given
    featureServiceMock.getFeature.and.returnValue(Observable.of(feature));
    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('div').innerText).toEqual('My content here');
    });
  }));

  it('should not render content if toggles is off and user-enabled on', async(() => {
    // given
    feature.attributes.enabled = false;
    feature.attributes['user-enabled'] = true;
    featureServiceMock.getFeature.and.returnValue(Observable.of(feature));
    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('div')).toBeNull();
    });
  }));

  it('should not render content if toggles is on and user-enabled off', async(() => {
    // given
    feature.attributes.enabled = true;
    feature.attributes['user-enabled'] = false;
    featureServiceMock.getFeature.and.returnValue(Observable.of(feature));
    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('div')).toBeNull();
    });
  }));

  it('should not render content if toggles is off and user-enabled off', async(() => {
    // given
    feature.attributes.enabled = false;
    feature.attributes['user-enabled'] = false;
    featureServiceMock.getFeature.and.returnValue(Observable.of(feature));
    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('div')).toBeNull();
    });
  }));
});
