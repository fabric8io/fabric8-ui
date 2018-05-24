import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Notifications, NotificationType } from 'ngx-base';
import { UserService } from 'ngx-login-client';
import { ListModule } from 'patternfly-ng';
import { Observable } from 'rxjs';
import { createMock } from 'testing/mock';
import { initContext, TestContext } from 'testing/test-context';
import { Feature, FeatureTogglesService } from '../../../feature-flag/service/feature-toggles.service';
import {
  ExtProfile,
  GettingStartedService
} from '../../../getting-started/services/getting-started.service';
import { FeatureOptInComponent } from './feature-opt-in.component';

@Component({
  template: `<alm-feature-opt-in></alm-feature-opt-in>`
})
class HostComponent {
  collapsed: boolean = false;
  applicationId: string = 'mockAppId';
  environment: string = 'mockEnvironment';
  spaceId: string = 'mockSpaceId';
  detailsActive: boolean = true;
}

describe('FeatureOptInComponent', () => {
  type Context = TestContext<FeatureOptInComponent, HostComponent>;

  let featureOptInComponent: FeatureOptInComponent;
  let gettingStartedServiceMock: jasmine.SpyObj<GettingStartedService>;
  let notificationsMock: jasmine.SpyObj<Notifications>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let toggleServiceMock: jasmine.SpyObj<FeatureTogglesService>;

  beforeEach(() => {
    gettingStartedServiceMock = createMock(GettingStartedService);
    toggleServiceMock = createMock(FeatureTogglesService);
    notificationsMock = createMock(Notifications);
    userServiceMock = createMock(UserService);
    (userServiceMock as any).currentLoggedInUser = {
      attributes: {
        featureLevel: 'beta',
        email: 'somebody@email.com',
        emailVerified: true
      }
    };
    toggleServiceMock.getAllFeaturesEnabledByLevel.and.returnValue(Observable.of([]));
    gettingStartedServiceMock.createTransientProfile.and.returnValue({ featureLevel: 'beta' } as ExtProfile);
    gettingStartedServiceMock.update.and.returnValue(Observable.of({}));
    notificationsMock.message.and.returnValue(Observable.of({}));
  });

  initContext(FeatureOptInComponent, HostComponent, {
    imports: [
      CommonModule,
      FormsModule,
      ListModule
    ],
    providers: [
      { provide: GettingStartedService, useFactory: () => gettingStartedServiceMock },
      { provide: Notifications, useFactory: () => notificationsMock },
      { provide: UserService, useFactory: () => userServiceMock },
      { provide: FeatureTogglesService, useFactory: () => toggleServiceMock }
    ]
  });

  it('should sort feature per level', function(this: TestContext<FeatureOptInComponent, HostComponent>) {
    const features = [   {
      'attributes': {
        'description': 'main dashboard view',
        'enabled': true,
        'enablement-level': 'released',
        'user-enabled': true
      },
      'id': 'Analyze'
    },
      {
        'attributes': {
          'description': 'new home dashboard experience',
          'enabled': true,
          'enablement-level': 'internal',
          'user-enabled': false
        },
        'id': 'Analyze.newHomeDashboard'
      },
      {
        'attributes': {
          'description': 'new space dashboard experience',
          'enabled': true,
          'enablement-level': 'experimental',
          'user-enabled': true
        },
        'id': 'Analyze.newSpaceDashboard'
      }] as Feature[];
    this.testedDirective.featureLevel = 'experimental';
    const result = this.testedDirective.featureByLevel(features);

    expect(result.released[0].id).toEqual(features[0].id);
    expect(result.internal[0].id).toEqual(features[1].id);
    expect(result.experimental[0].id).toEqual(features[2].id);
    expect(result.experimental[0].attributes.name).toEqual('Analyze newSpaceDashboard');
  });

  describe('updateProfile', () => {
    it('should call GettingStartedService#update and send a notification', function(this: TestContext<FeatureOptInComponent, HostComponent>) {
      const gettingStartedService: jasmine.SpyObj<GettingStartedService> = TestBed.get(GettingStartedService);
      const notifications: jasmine.SpyObj<Notifications> = TestBed.get(Notifications);

      this.testedDirective.updateProfile({
        item: { name: 'beta' },
        selectedItems: [ { name: 'beta' } ]
      });
      expect(gettingStartedService.update).toHaveBeenCalled();
      expect(notifications.message).toHaveBeenCalled();
    });

    it('should update the feature level', function(this: TestContext<FeatureOptInComponent, HostComponent>) {
      const gettingStartedService: jasmine.SpyObj<GettingStartedService> = TestBed.get(GettingStartedService);
      const notifications: jasmine.SpyObj<Notifications> = TestBed.get(Notifications);

      expect(this.testedDirective.featureLevel).toBe('beta');
      this.testedDirective.featureLevel = 'experimental';
      this.testedDirective.updateProfile({
        item: { name: 'experimental' },
        selectedItems: [{ name: 'experimental' }]
      });

      expect(gettingStartedService.update).toHaveBeenCalledWith({ featureLevel: 'experimental', contextInformation: Object({}) } as ExtProfile);
      expect(notifications.message).toHaveBeenCalledWith(jasmine.objectContaining({
        message: 'Profile updated!',
        type: NotificationType.SUCCESS
      }));
    });

    it('should cancel events deselecting a feature level', function(this: TestContext<FeatureOptInComponent, HostComponent>) {
      const gettingStartedService: jasmine.SpyObj<GettingStartedService> = TestBed.get(GettingStartedService);
      const notifications: jasmine.SpyObj<Notifications> = TestBed.get(Notifications);

      this.testedDirective.updateProfile({
        item: { name: 'beta' },
        selectedItems: []
      });
      expect(gettingStartedService.update).not.toHaveBeenCalled();
      expect(notifications.message).not.toHaveBeenCalled();
    });
  });

});
