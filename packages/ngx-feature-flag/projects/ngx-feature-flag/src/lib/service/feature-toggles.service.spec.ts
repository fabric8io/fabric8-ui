import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ErrorHandler } from '@angular/core';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import { cloneDeep } from 'lodash';
import { AuthenticationService } from 'ngx-login-client';
import { first } from 'rxjs/operators';
import { Feature } from '../models/feature';
import { FABRIC8_FEATURE_TOGGLES_API_URL, FeatureTogglesService } from './feature-toggles.service';

describe('FeatureToggles service:', () => {

  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockErrorHandler: any;
  let togglesService: FeatureTogglesService;
  let httpTestingController: HttpTestingController;

  const feat1 =  {
    attributes: {
      'user-enabled': true,
      'enabled': true,
      'enablement-level': 'beta',
      'description': 'boo',
      'name': 'Deployments.featureA'
    },
    id: 'Deployments.featureA'
  } as Feature;
  const feat2 = {
    attributes: {
      'user-enabled': true,
      'enabled': true,
      'enablement-level': 'beta',
      'description': 'boo',
      'name': 'Deployments.featureB'
    },
    id: 'Deployments.featureB'
  } as Feature;

  const features1And2 = [feat1, feat2];
  const expectedResponse1And2 = {data: features1And2};
  let url: string;


  beforeEach(() => {
    mockErrorHandler = jasmine.createSpy('ErrorHandler');
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockAuthService
        },
        {
          provide: ErrorHandler,
          useValue: mockErrorHandler
        },
        {
          provide: FABRIC8_FEATURE_TOGGLES_API_URL,
          useValue: 'http://example.com'
        },
        FeatureTogglesService
      ]
    });
    togglesService = getTestBed().get(FeatureTogglesService);
    httpTestingController = getTestBed().get(HttpTestingController);
    url = getTestBed().get(FABRIC8_FEATURE_TOGGLES_API_URL);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should retrieve all features', async(() => {
    // given
    const expectedResponse = {
      data: [
        {
          attributes: {
            'user-enabled': true,
            'enabled': true,
            'enablement-level': 'beta',
            'description': 'boo',
            'name': 'Deployments'
          },
          id: 'Deployments'
        },
        {
          attributes: {
            'user-enabled': true,
            'enabled': true,
            'enablement-level': 'beta',
            'description': 'boo',
            'name': 'Environments'
          },
          id: 'Environments'
        }
        ]};
    // when
    togglesService.getFeatures(['Deployments', 'Environments']).pipe(first()).subscribe((features: Feature[]) => {
      // then
      expect(features.length).toEqual(2);
      expect((features[0] as Feature).id).toEqual(expectedResponse.data[0].id);
      expect((features[0] as Feature).attributes['name']).
      toEqual(expectedResponse.data[0].attributes['name']);
    });

    const req = httpTestingController.expectOne(request => request.method === 'GET' && request.url === `${url}/features`);
    req.flush(expectedResponse);
  }));

  it('should retrieve all features for the strategy `enableByLevel`', async(() => {
    // given
    const expectedResponse = {
      data: [
        {
          attributes: {
            'user-enabled': true,
            'enabled': true,
            'enablement-level': 'beta',
            'description': 'boo',
            'name': 'Deployments'
          },
          id: 'Deployments'
        },
        {
          attributes: {
            'user-enabled': true,
            'enabled': true,
            'enablement-level': 'beta',
            'description': 'boo',
            'name': 'Environments'
          },
          id: 'Environments'
        }
      ]};
    // when
    togglesService.getAllFeaturesEnabledByLevel().pipe(first()).subscribe((features: Feature[]) => {
      // then
      expect(features.length).toEqual(2);
      expect((features[0] as Feature).id).toEqual(expectedResponse.data[0].id);
      expect((features[0] as Feature).attributes['name']).
      toEqual(expectedResponse.data[0].attributes['name']);
    });
    const req = httpTestingController.expectOne(request => request.method === 'GET' && request.url === `${url}/features`);
    req.flush(expectedResponse);
  }));


  it('should retrieve all features per page', async(() => {
    // given
    const expectedResponse = {
      data: [
        {
          attributes: {
            'user-enabled': true,
            'enabled': true,
            'enablement-level': 'beta',
            'description': 'boo',
            'name': 'Deployments.featureA'
          },
          id: 'Deployments.featureA'
        },
        {
          attributes: {
            'user-enabled': true,
            'enabled': true,
            'enablement-level': 'beta',
            'description': 'boo',
            'name': 'Deployments.featureB'
          },
          id: 'Deployments.featureB'
        }
      ]};
    // when
    togglesService.getFeaturesPerPage('Deployments').pipe(first()).subscribe((features: Feature[]) => {
      // then
      expect(features as Feature[]).toBeTruthy();
      expect((features as Feature[]).length).toEqual(2);
      expect((features[0] as Feature).id).toEqual(expectedResponse.data[0].id);
      expect((features[0] as Feature).attributes['name']).
      toEqual(expectedResponse.data[0].attributes['name']);
    });
    const req = httpTestingController.expectOne(request => request.method === 'GET' && request.url === `${url}/features`);
    req.flush(expectedResponse);
  }));

  it('should update cache', async(() => {
    // when
     togglesService.getFeaturesPerPage('Deployments').pipe(first()).subscribe(() => {
      // then
      expect(togglesService._featureFlagCache.get('Deployments')).toEqual(features1And2);
    });
    // when
    togglesService._featureFlagCache.set('Deployments', [feat1]);
    togglesService.getFeaturesPerPage('Deployments').pipe(first()).subscribe(() => {
      // then
      expect(togglesService._featureFlagCache.get('Deployments')).toEqual(features1And2);
    });
    // when
    const feat1bis = cloneDeep(feat1);
    feat1bis.attributes.description = 'ANOTHER DESCRIPTION';
    togglesService._featureFlagCache.set('Deployments', [feat1bis, feat2]);
    togglesService.getFeaturesPerPage('Deployments').pipe(first()).subscribe(() => {
      // then
      expect(togglesService._featureFlagCache.get('Deployments')).toEqual(features1And2);
    });
    const req = httpTestingController.match(request => request.method === 'GET' && request.url === `${url}/features`);
    req.forEach(r => r.flush(expectedResponse1And2));
  }));

  it('should tell whether the feature is enabled', async(() => {
    // given
    const expectedResponse = {
      data: {
        attributes: {
          'user-enabled': true,
          'enabled': true,
          'enablement-level': 'beta',
          'description': 'boo',
          'name': 'Planner'
        },
        id: 'Planner'
      }
    };
    // when
    togglesService.getFeature('Planner').pipe(first()).subscribe((feature: any) => {
      // then
      expect((feature as Feature).id).toEqual(expectedResponse.data.id);
      expect((feature as Feature).attributes['name']).toEqual(expectedResponse.data.attributes['name']);
    });
    const req = httpTestingController.expectOne(request => request.method === 'GET' && request.url === `${url}/features/Planner`);
    req.flush(expectedResponse);
  }));

  it('should tell whether the feature is enabled using cached value', async(() => {
    // given
    const plannerFeature = {
      attributes: {
        'user-enabled': true,
        'enabled': true,
        'enablement-level': 'beta',
        'description': 'boo',
        'name': 'Planner'
      },
      id: 'Planner'
    } as Feature;
    const expectedResponse = {
      data: plannerFeature
    };
    // when
    togglesService._featureFlagCache.set('Planner', [plannerFeature]);
    togglesService.getFeature('Planner').pipe(first()).subscribe((features: any) => {
      // then
      expect((features as Feature).id).toEqual(expectedResponse.data.id);
      expect((features as Feature).attributes['name']).toEqual(expectedResponse.data.attributes['name']);
    });
  }));

  it('should return  if feature is user enabled', async(() => {
    const featureBody = {
      data: {
        attributes: {
          'user-enabled': true,
          'enabled': true,
          'enablement-level': 'beta',
          'description': 'boo',
          'name': 'Planner'
        },
        id: 'Planner'
      }
    };

    togglesService.isFeatureUserEnabled('Planner').pipe(first()).subscribe(
      (isUserEnabled: boolean) => {
        expect(isUserEnabled).toBe(true);
      }
    );
    const req = httpTestingController.expectOne(request => request.method === 'GET' && request.url === `${url}/features/Planner`);
    req.flush(featureBody);
  }));

  it('should return false for unexpected feature response', async(() => {
    togglesService.isFeatureUserEnabled('Planner').pipe(first()).subscribe(
      (isUserEnabled: boolean) => {
        expect(isUserEnabled).toBe(false);
      }
    );
    const req = httpTestingController.expectOne(request => request.method === 'GET' && request.url === `${url}/features/Planner`);
    req.flush('');
  }));

  it('should return false for feature response error', async(() => {

    togglesService.isFeatureUserEnabled('Planner').pipe(first()).subscribe(
      (isUserEnabled: boolean) => {
        expect(isUserEnabled).toBe(false);
      }
    );
    const req = httpTestingController.expectOne(request => request.method === 'GET' && request.url === `${url}/features/Planner`);
    req.error(new ErrorEvent('Mock HTTP Error'), {status: 404});
  }));

});
