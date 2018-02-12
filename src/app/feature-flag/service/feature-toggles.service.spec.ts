import { TestBed } from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { Feature, FeatureTogglesService } from './feature-toggles.service';

describe('FeatureToggles service: it', () => {
  let mockLog: any;
  let mockAuthService: any;
  let mockService: MockBackend;
  let togglesService: FeatureTogglesService;
  beforeEach(() => {
    mockLog = jasmine.createSpyObj('Logger', ['log']);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: Logger, useValue: mockLog
        },
        {
          provide: XHRBackend, useClass: MockBackend
        },
        {
          provide: AuthenticationService,
          useValue: mockAuthService
        },
        {
          provide: WIT_API_URL,
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

  it('should tell whether the feature is enabled', () => {
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
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedResponse),
          status: 200
        })
      ));
    });
    // when
    togglesService.getFeature('Planner').subscribe((feature: any) => {
      // then
      expect((feature as Feature).id).toEqual(expectedResponse.data.id);
      expect((feature as Feature).attributes['name']).toEqual(expectedResponse.data.attributes['name']);
    });
  });

});
