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
        {'experimental': [],
          'internal':
            [
              {'attributes':
                  {'description': 'Planner menu',
                    'enabled': true,
                    'enablement-level': 'experimental',
                    'user-enabled': true,
                    'name': 'Planner'},
                'id': 'Planner'}],
          'beta': []
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
    // given
    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('.fa-lock').attributes['class'].value).toEqual('fa fa-lock fa-1x');
    });
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
