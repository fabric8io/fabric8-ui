import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { cloneDeep } from 'lodash';
import { AuthenticationService } from 'ngx-login-client';
import { FABRIC8_FEATURE_TOGGLES_API_URL, FeatureTogglesService} from './feature-toggles.service';
import { Feature } from '../models/feature';

describe('FeatureToggles service:', () => {
  let mockAuthService: any;
  let mockErrorHandler: any;
  let mockService: MockBackend;
  let togglesService: FeatureTogglesService;
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


  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: XHRBackend, useClass: MockBackend
        },
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
    togglesService = TestBed.get(FeatureTogglesService);
    mockService = TestBed.get(XHRBackend);
  });

  it('should retrieve all features', () => {
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
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedResponse),
          status: 200
        })
      ));
    });
    // when
    togglesService.getFeatures(['Deployments', 'Environments']).subscribe((features: any) => {
      // then
      expect(features.length).toEqual(2);
      expect((features[0] as Feature).id).toEqual(expectedResponse.data[0].id);
      expect((features[0] as Feature).attributes['name']).
      toEqual(expectedResponse.data[0].attributes['name']);
    });
  });

  it('should retrieve all features for the strategy `enableByLevel`', () => {
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
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedResponse),
          status: 200
        })
      ));
    });
    // when
    togglesService.getAllFeaturesEnabledByLevel().subscribe((features: any) => {
      // then
      expect(features.length).toEqual(2);
      expect((features[0] as Feature).id).toEqual(expectedResponse.data[0].id);
      expect((features[0] as Feature).attributes['name']).
      toEqual(expectedResponse.data[0].attributes['name']);
    });
  });


  it('should retrieve all features per page', () => {
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
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedResponse),
          status: 200
        })
      ));
    });
    // when
    togglesService.getFeaturesPerPage('Deployments').subscribe(features => {
      // then
      expect(features.length).toEqual(2);
      expect((features[0] as Feature).id).toEqual(expectedResponse.data[0].id);
      expect((features[0] as Feature).attributes['name']).
      toEqual(expectedResponse.data[0].attributes['name']);
    });
  });

  it('should update cache', () => {
    // given
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedResponse1And2),
          status: 200
        })
      ));
    });
    // when
     togglesService.getFeaturesPerPage('Deployments').subscribe(() => {
      // then
      expect(togglesService._featureFlagCache.get('Deployments')).toEqual(features1And2);
    });
    // when
    togglesService._featureFlagCache.set('Deployments', [feat1]);
    togglesService.getFeaturesPerPage('Deployments').subscribe(() => {
      // then
      expect(togglesService._featureFlagCache.get('Deployments')).toEqual(features1And2);
    });
    // when
    let feat1bis = cloneDeep(feat1);
    feat1bis.attributes.description = 'ANOTHER DESCRIPTION';
    togglesService._featureFlagCache.set('Deployments', [feat1bis, feat2]);
    togglesService.getFeaturesPerPage('Deployments').subscribe(() => {
      // then
      expect(togglesService._featureFlagCache.get('Deployments')).toEqual(features1And2);
    });
  });

  it('should tell whether the feature is enabled', () => {
    // given
    const expectedResponse = {
      data: [{
        attributes: {
          'user-enabled': true,
          'enabled': true,
          'enablement-level': 'beta',
          'description': 'boo',
          'name': 'Planner'
        },
        id: 'Planner'
      }]
    };
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedResponse),
          status: 200
        })
      ));
    });
    // when
    togglesService.getFeatures(['Planner']).subscribe((feature: any) => {
      // then
      expect((feature as Feature[])[0].id).toEqual(expectedResponse.data[0].id);
      expect((feature as Feature[])[0].attributes['name']).toEqual(expectedResponse.data[0].attributes['name']);
    });
  });

  it('should tell whether the feature is enabled using cached value', () => {
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
    togglesService.getFeatures(['Planner']).subscribe((features: any) => {
      // then
      expect((features as Feature[])[0].id).toEqual(expectedResponse.data.id);
      expect((features as Feature[])[0].attributes['name']).toEqual(expectedResponse.data.attributes['name']);
    });
  });

});
