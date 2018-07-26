import { HttpClientModule } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { FeatureFlagMapping } from '../feature-flag.mapping';
import { Feature } from '../models/feature';
import { FeatureTogglesService } from '../service/feature-toggles.service';
import { FeatureContainerComponent } from './feature-loader.component';


@Component({
  selector: `f8-my-feature-component-under-dev`,
  template: `<div>Display Something</div>`
})
class MyFeatureComponentUnderDevComponent {
}
// https://github.com/angular/angular/issues/10760
@NgModule({
  declarations: [MyFeatureComponentUnderDevComponent],
  exports: [MyFeatureComponentUnderDevComponent],
  entryComponents: [MyFeatureComponentUnderDevComponent]
})
class TestModule { }

@Component({
  selector: `f8-host-component`,
  template: `<f8-feature-toggle-loader featureName="Test"></f8-feature-toggle-loader>`
})
class TestHostComponent {
}

describe('FeatureContainerComponent', () => {
  let featureServiceMock: any;
  let featureFlagMappingMock: any;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  const feature: Feature = {
    attributes: {
      name: 'Test',
      description: 'Description',
      enabled: true,
      'enablement-level': 'beta',
      'user-enabled': true
    },
    id: 'Test'
  };


  beforeEach(() => {
    featureServiceMock = jasmine.createSpyObj('FeatureTogglesService', ['getFeature']);
    featureFlagMappingMock = jasmine.createSpyObj('FeatureFlagMapping', ['convertFeatureNameToComponent']);

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, TestModule],
      declarations: [FeatureContainerComponent, TestHostComponent],
      providers: [
        {
          provide: FeatureTogglesService, useValue: featureServiceMock
        },
        {
          provide: FeatureFlagMapping, useValue: featureFlagMappingMock
        }
      ]
    });


    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
  });

  it('should render content if toggles is on and user-enabled on', async(() => {
    // given
    featureServiceMock.getFeature.and.returnValue(of(feature));
    featureFlagMappingMock.convertFeatureNameToComponent.and.returnValue(MyFeatureComponentUnderDevComponent);
    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('f8-my-feature-component-under-dev').innerText).toEqual('Display Something');
    });
  }));

  it('should not render content if toggles is off and user-enabled on', async(() => {
    // given
    feature.attributes.enabled = false;
    feature.attributes['user-enabled'] = true;
    featureServiceMock.getFeature.and.returnValue(of(feature));
    featureFlagMappingMock.convertFeatureNameToComponent.and.returnValue(MyFeatureComponentUnderDevComponent);
    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('f8-my-feature-component-under-dev')).toBeNull();
    });
  }));

  it('should not render content if toggles is on and user-enabled off', async(() => {
    // given
    feature.attributes.enabled = true;
    feature.attributes['user-enabled'] = false;
    featureServiceMock.getFeature.and.returnValue(of(feature));
    featureFlagMappingMock.convertFeatureNameToComponent.and.returnValue(MyFeatureComponentUnderDevComponent);
    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('f8-my-feature-component-under-dev')).toBeNull();
    });
  }));

  it('should not render content if toggles is off and user-enabled off', async(() => {
    // given
    feature.attributes.enabled = false;
    feature.attributes['user-enabled'] = false;
    featureServiceMock.getFeature.and.returnValue(of(feature));
    featureFlagMappingMock.convertFeatureNameToComponent.and.returnValue(MyFeatureComponentUnderDevComponent);
    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('f8-my-feature-component-under-dev')).toBeNull();
    });
  }));
});
