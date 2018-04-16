import { TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import {AuthenticationService, UserService} from 'ngx-login-client';
import { Feature, FeatureTogglesService } from '../service/feature-toggles.service';

import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FeatureFlagConfig } from '../../models/feature-flag-config';
import { FeatureFlagResolver } from './feature-flag.resolver';

describe('FeatureFlag resolver: it', () => {
  let mockLog: any;
  let mockRouter: any;
  let mockTogglesService: any;
  let mockUserService: any;
  let resolver: FeatureFlagResolver;
  let mockActivatedRoute: any;
  beforeEach(() => {
    mockLog = jasmine.createSpyObj('Logger', ['log']);
    mockTogglesService = jasmine.createSpyObj('FeatureTogglesService', ['getFeaturesPerPage']);
    mockUserService = jasmine.createSpy('UserService');
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
          provide: UserService,
          useValue: mockUserService
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
    mockUserService.currentLoggedInUser = {
      attributes: {
        featureLevel: 'internal'
      }
    };
    let feature = {id: 'Deployment', attributes: {
      enabled: true,
      'user-enabled': true,
      'enablement-level': 'internal'
    }} as Feature;
    const expected = {
      'user-level': 'internal',
      featuresPerLevel: {
        internal: [{
          id: 'Deployment',
          attributes: {
            enabled: true,
            'user-enabled': true,
            'enablement-level': 'internal'
          }
        }],
        experimental: [],
        beta: []
      }
    } as FeatureFlagConfig;
    mockTogglesService.getFeaturesPerPage.and.returnValue(Observable.of([feature]));
    // when
    resolver.resolve(route as ActivatedRouteSnapshot, null).subscribe(val => {
      // then
      expect(val.featuresPerLevel.internal.length).toEqual(1);
      expect(val.featuresPerLevel.internal[0].id).toEqual(expected.featuresPerLevel.internal[0].id);
      expect(val['user-level']).toEqual(expected['user-level']);
    });
  });

  it('should route to error when requested feature is not-enabled', () => {
    // given
    let route = new ActivatedRouteSnapshot();
    route.data = {featureName: 'Deployment'};
    mockUserService.currentLoggedInUser = {
      attributes: {
        featureLevel: 'internal'
      }
    };
    let feature = {id: 'Deployment', attributes: {
      enabled: false,
      'user-enabled': true,
      'enablement-level': 'internal'
    }} as Feature;
    mockTogglesService.getFeaturesPerPage.and.returnValue(Observable.of([feature]));
    // when
    resolver.resolve(route, null).subscribe(val => {
      // then
      expect(val).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/_error']);
    });
  });

  it('should route to opt-in when requested feature is not-user-enabled', () => {
    // given
    let route = new ActivatedRouteSnapshot();
    route.data = {featureName: 'Deployment'};
    mockUserService.currentLoggedInUser = {
      attributes: {
        featureLevel: 'beta'
      }
    };
    let feature = {id: 'Deployment', attributes: {
      enabled: true,
      'user-enabled': false,
       'enablement-level': 'internal'
    }} as Feature;
    mockTogglesService.getFeaturesPerPage.and.returnValue(Observable.of([feature]));
    // when
    resolver.resolve(route, null).subscribe(val => {
      // then
      expect(val).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/_featureflag'], {queryParams: {
          showBanner: 'internal'
        }});
    });
  });
});
