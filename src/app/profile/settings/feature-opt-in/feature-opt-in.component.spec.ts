import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Notifications } from 'ngx-base';
import { UserService } from 'ngx-login-client';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { createMock } from 'testing/mock';
import { initContext, TestContext } from 'testing/test-context';
import {
  ExtProfile,
  ExtUser,
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

  beforeEach(() => {
    gettingStartedServiceMock = createMock(GettingStartedService);
    notificationsMock = createMock(Notifications);
    userServiceMock = createMock(UserService);
    gettingStartedServiceMock.createTransientProfile.and.returnValue({ featureLevel: 'beta' } as ExtProfile);
    gettingStartedServiceMock.update.and.returnValue(Observable.of({}));
    notificationsMock.message.and.returnValue(Observable.of({}));
  });

  initContext(FeatureOptInComponent, HostComponent, {
    imports: [
      CommonModule,
      FormsModule
    ],
    providers: [
      { provide: GettingStartedService, useFactory: () => gettingStartedServiceMock },
      { provide: Notifications, useFactory: () => notificationsMock },
      { provide: UserService, useFactory: () => userServiceMock }
    ]
  });

  it('should call update profile with the appropriate feature level', function(this: TestContext<FeatureOptInComponent, HostComponent>) {
    const gettingStartedService: GettingStartedService = TestBed.get(GettingStartedService);

    expect(this.testedDirective.featureLevel).toBe('beta');
    this.testedDirective.featureLevel = 'experimental';
    this.testedDirective.updateProfile();

    expect(gettingStartedService.update).toHaveBeenCalledWith({ featureLevel: 'experimental', contextInformation: Object({  }) } as ExtProfile);
  });

  it('should call gettingStartedService when updateUser is called', function(this: TestContext<FeatureOptInComponent, HostComponent>) {
    const gettingStartedService: GettingStartedService = TestBed.get(GettingStartedService);

    this.testedDirective.updateProfile();
    expect(gettingStartedService.update).toHaveBeenCalled();
  });

});
