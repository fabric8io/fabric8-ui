import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalModule } from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FeatureFlagConfig } from '../../models/feature-flag-config';
import { FeatureFooterComponent } from './feature-footer.component';
import { FeatureFooterModule } from './feature-footer.module';

describe('FeatureFooterComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  @Component({
    selector: `host-component`,
    template: `<f8-feature-footer [featurePageConfig]="config"></f8-feature-footer>`
  })
  class TestHostComponent {
    config = {
      'user-level': 'internal',
      'featuresPerLevel':
        {
          'experimental': [{'attributes':
              {'description': 'Planner menu',
                'enabled': true,
                'enablement-level': 'experimental',
                'user-enabled': true,
                'name': 'Planner featureA'},
            'id': 'Planner.featureA'}],
          'internal': [{'attributes':
              {'description': 'Planner menu',
                'enabled': true,
                'enablement-level': 'internal',
                'user-enabled': true,
                'name': 'Planner'},
              'id': 'Planner'}],
          'beta': [{'attributes':
              {'description': 'Planner menu',
                'enabled': true,
                'enablement-level': 'beta',
                'user-enabled': true,
                'name': 'Planner featureB'},
            'id': 'Planner.featureB'}]
        }
    } as FeatureFlagConfig;
  }
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [FeatureFooterModule, TooltipModule, ModalModule.forRoot()],
      declarations: [TestHostComponent],
      providers: []
    });

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
  });

  it('should render internal icon when user level is internal', async(() => {
    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('.fa-flask').attributes['class'].value).toEqual('fa fa-flask fa-1x');
    });
  }));
});

describe('FeatureFooterComponent', () => {
  let hostComponent: FeatureFooterComponent;
  let hostFixture: ComponentFixture<FeatureFooterComponent>;
  let config: FeatureFlagConfig;

  beforeEach(() => {
    config = {
      'user-level': 'internal',
      'featuresPerLevel':
        {
          'experimental': [{'attributes':
              {'description': 'Planner menu',
                'enabled': true,
                'enablement-level': 'experimental',
                'user-enabled': true,
                'name': 'Planner featureA'},
            'id': 'Planner.featureA'}],
          'internal': [{'attributes':
              {'description': 'Planner menu',
                'enabled': true,
                'enablement-level': 'internal',
                'user-enabled': true,
                'name': 'Planner'},
            'id': 'Planner'}],
          'beta': [{'attributes':
              {'description': 'Planner menu',
                'enabled': true,
                'enablement-level': 'beta',
                'user-enabled': true,
                'name': 'Planner featureB'},
            'id': 'Planner.featureB'}]
        }
    } as FeatureFlagConfig;
    TestBed.configureTestingModule({
      imports: [FeatureFooterModule, TooltipModule, ModalModule.forRoot()],
      declarations: [],
      providers: []
    });

    hostFixture = TestBed.createComponent(FeatureFooterComponent);
    hostComponent = hostFixture.componentInstance;
    hostComponent.featurePageConfig = config;
  });

  it('should display feature descriptions', async(() => {
    hostComponent.descriptionPerLevel();
    expect(hostComponent.experimentalFeatureText).toEqual('is 1 experimental feature');
    expect(hostComponent.internalFeatureText).toEqual('is 1 internal feature');
    expect(hostComponent.betaFeatureText).toEqual('is 1 beta feature');
    config.featuresPerLevel.beta.push({'attributes':
      {'description': 'Planner menu',
        'enabled': true,
        'enablement-level': 'beta',
        'user-enabled': true,
        'name': 'Planner featureC'},
      'id': 'Planner.featureC'});
    hostComponent.descriptionPerLevel();
    expect(hostComponent.betaFeatureText).toEqual('are 2 beta features');
  }));

  it('should not be empty for internal when there are features for exp, beta and internal', async(() => {
    expect(hostComponent.isNotEmpty('internal')).toBeTruthy();
  }));
  it('should not be empty for internal when there are features for exp, beta', async(() => {
    config.featuresPerLevel.internal = [];
    expect(hostComponent.isNotEmpty('internal')).toBeTruthy();
  }));
  it('should not be empty for internal when there are features for exp', async(() => {
    config.featuresPerLevel.internal = [];
    config.featuresPerLevel.beta = [];
    expect(hostComponent.isNotEmpty('internal')).toBeTruthy();
  }));
  it('should not be empty for internal when there are features for beta', async(() => {
    config.featuresPerLevel.experimental = [];
    expect(hostComponent.isNotEmpty('internal')).toBeTruthy();
  }));

  it('should not be empty for experimental when there are features for exp, beta', async(() => {
    config.featuresPerLevel.internal = [];
    expect(hostComponent.isNotEmpty('experimental')).toBeTruthy();
  }));
  it('should not be empty for experimental when there are features for exp', async(() => {
    config.featuresPerLevel.beta = [];
    expect(hostComponent.isNotEmpty('experimental')).toBeTruthy();
  }));
  it('should not be empty for experimental when there are features for beta', async(() => {
    config.featuresPerLevel.experimental = [];
    expect(hostComponent.isNotEmpty('experimental')).toBeTruthy();
  }));


  it('should not be empty for beta when there are features for beta', async(() => {
    expect(hostComponent.isNotEmpty('beta')).toBeTruthy();
  }));
});

describe('FeatureFooterComponent with error', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  @Component({
    selector: `host-component`,
    template: `<f8-feature-footer [featurePageConfig]="config"></f8-feature-footer>`
  })
  class TestHostComponent {
    config = {
      showBanner: 'systemError'
    } as FeatureFlagConfig;
  }
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [FeatureFooterModule, TooltipModule, ModalModule.forRoot()],
      declarations: [TestHostComponent],
      providers: []
    });

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
  });

  it('should render not render internal icon when user level is internal', async(() => {
    // given
    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('.fa-lock')).toBeNull();
    });
  }));

});
