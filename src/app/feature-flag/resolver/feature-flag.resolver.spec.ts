import { TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { Feature, FeatureTogglesService } from '../service/feature-toggles.service';

import { ActivatedRouteSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { FeatureFlagConfig } from '../../models/feature-flag-config';
import { FeatureFlagResolver } from './feature-flag.resolver';

describe('FeatureFlag resolver: it', () => {
  let mockLog: any;
  let mockAuthService: any;
  let mockRouter: any;
  let mockTogglesService: any;
  let resolver: FeatureFlagResolver;
  let mockActivatedRoute: any;
  beforeEach(() => {
    mockLog = jasmine.createSpyObj('Logger', ['log']);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['isLoggedIn']);
    mockAuthService.isLoggedIn.and.returnValue(true);
    mockTogglesService = jasmine.createSpyObj('FeatureTogglesService', ['getFeature']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpy('ActivatedRouteSnapshot');
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Logger,
          useValue: mockLog
        },
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: AuthenticationService,
          useValue: mockAuthService
        },
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: FeatureTogglesService,
          useValue: mockTogglesService
        },
        FeatureFlagResolver
      ]
    });
    resolver = TestBed.get(FeatureFlagResolver);
  });

  it('should route to requested feature', () => {
    // given
    let route = new ActivatedRouteSnapshot();
    route.data = {featureName: 'Deployment'};
    let feature = {id: 'Deployment', attributes: {
      enabled: true,
      'user-enabled': true,
      'enablement-level': 'internal'
    }} as Feature;
    const expected = {
      name: 'Deployment',
      showBanner: 'internal',
      enabled: true
    } as FeatureFlagConfig;
    mockTogglesService.getFeature.and.returnValue(Observable.of(feature));
    // when
    resolver.resolve(route as ActivatedRouteSnapshot, null).subscribe(val => {
      // then
      expect(val.name).toEqual(expected.name);
      expect(val.showBanner).toEqual(expected.showBanner);
      expect(val.enabled).toEqual(expected.enabled);
    });
  });

  it('should route to error when requested feature is not-enabled', () => {
    // given
    let route = new ActivatedRouteSnapshot();
    route.data = {featureName: 'Deployment'};
    let feature = {id: 'Deployment', attributes: {
      enabled: false,
      'user-enabled': true,
      'enablement-level': 'internal'
    }} as Feature;
    mockTogglesService.getFeature.and.returnValue(Observable.of(feature));
    // when
    resolver.resolve(route, null).subscribe(val => {
      // then
      expect(val).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/_error']);
    });
  });

  it('should route to error when requested feature is not-user-enabled', () => {
    // given
    let route = new ActivatedRouteSnapshot();
    route.data = {featureName: 'Deployment'};
    let feature = {id: 'Deployment', attributes: {
      enabled: true,
      'user-enabled': false
    }} as Feature;
    mockTogglesService.getFeature.and.returnValue(Observable.of(feature));
    // when
    resolver.resolve(route, null).subscribe(val => {
      // then
      expect(val).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/_error']);
    });
  });
});
