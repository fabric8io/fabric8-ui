/*
import {
  BaseRequestOptions,
  Http,
  Response,
  ResponseOptions
} from '@angular/http';
import {
  async,
  inject,
  TestBed
} from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { cloneDeep } from 'lodash';
import { Broadcaster, Logger} from 'ngx-base';
import { Spaces } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { Notifications } from 'ngx-base';

import { MockHttp } from '../mock/mock-http';
import { HttpService } from './http-service';
import { SpacesService } from '../mock/standalone/spaces.service';
import { IterationModel } from '../models/iteration.model';
import { IterationService } from './iteration.service';
import { GlobalSettings } from '../shared/globals';

describe('Iteration service - ', () => {
  let apiService: IterationService;
  let mockService: MockBackend;

  let fakeAuthService: any;
  let fakeSpace: any;

  beforeEach(() => {
    fakeAuthService = {
      getToken: function () {
        return '';
      },
      isLoggedIn: function () {
        return true;
      }
    };

    fakeSpace = {
      'links': {
        'self': 'http://localhost:8080/api/'
      },
      'relationships': {
        'areas': {
          'links': {
            'related': 'http://localhost:8080/api/spaces/1f669678-ca2c-4cbb-b46d-5b70a98dde3c/areas'
          }
        },
        'iterations': {
          'links': {
            'related': 'http://localhost:8080/api/spaces/1f669678-ca2c-4cbb-b46d-5b70a98dde3c/iterations'
          }
        }
      },
      name: 'Project 1',
    };

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule
      ],
      providers: [
        Broadcaster,
        Logger,
        BaseRequestOptions,
        MockBackend,
        MockHttp,
        Notifications,
        {
          provide: HttpService,
          useFactory: (backend: MockBackend,
            options: BaseRequestOptions) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AuthenticationService,
          useValue: fakeAuthService
        },
        IterationService,
        GlobalSettings,
        {
          provide: Spaces,
          useExisting: SpacesService
        },
        SpacesService
      ]
    });
  });

  beforeEach(inject(
    [IterationService, MockBackend],
    (service: IterationService, mock: MockBackend) => {
      apiService = service;
      mockService = mock;
      (apiService as any)._currentSpace = fakeSpace;
    }
  ));

  let resp: IterationModel[] = [{
    attributes: {
      endAt: '2016-11-29T23:18:14Z',
      name: 'Sprint #24',
      startAt: '2016-11-29T23:18:14Z',
      state: 'start',
      parent_path: '',
      resolved_parent_path: ''
    },
    id: 'd8535583-dfbd-4b62-be8d-44a7d4fa7048',
    links: {
      self: 'http://localhost:8080/api/iterations/d8535583-dfbd-4b62-be8d-44a7d4fa7048'
    },
    relationships: {
      parent: {
        data: {
          id: '',
          type: ''
        },
        links: {
          self: ''
        }
      },
      space: {
        data: {
          id: 'd7d98b45-415a-4cfc-add2-ec7b7aee7dd5',
          type: 'spaces'
        },
        links: {
          self: 'http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5'
        }
      },
      workitems: {
        links: {
          related: 'http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/workitems'
        },
        meta: {
          closed: 0,
          total: 0
        }
      }
    },
    type: 'iterations'
  }];
  let response = { data: resp, links: {} };
  let checkResp = cloneDeep(resp);

  it('Get iterations', async(() => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(response),
          status: 200
        })
      ));
    });
    apiService.getIterations()
      .subscribe(data => {
        expect(data).toEqual(checkResp);
      });

    // For an invalid URL
    apiService.getIterations()
      .subscribe(() => {

      },
      (err: any) => {
        expect(err).toEqual([]);
      });

    // Check if data from response is assigned to the private variable
    apiService.getIterations()
      .subscribe(data => {
        expect(apiService.iterations).toEqual(checkResp);
      });

    apiService.getIterations()
      .subscribe(() => {},
      (err) => {
        expect(apiService.iterations).toEqual([]);
      });
  }));

  // Test if the API returns error
  it('Get iteration with error', async(() => {
    let url1 = 'http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/iterations';

    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: {},
          status: 404
        })
      ));
    });

    // Error response
    apiService.getIterations()
      .subscribe(() => {
      },
      () => {
        expect(apiService.iterations.length).toEqual(0);
      });
  }));

  // Test if everything is okay
  it('Create iteration', async(() => {
    let requestParams = resp[0];
    let responseData = cloneDeep(requestParams);
    let response = { data: responseData };

    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(response),
          status: 200
        })
      ));
    });

    apiService.createIteration(requestParams, null)
      .do(data => {
        expect(data).toEqual(responseData);
      })
      .do(() => {
        expect(apiService.iterations.length).toEqual(1);
      });
  }));

  // Test if the API returns error
  it('Create iteration with error', async(() => {
    let requestParams = resp[0];
    let url1 = 'http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/iterations';

    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: {},
          status: 404
        })
      ));
    });

    // Error response
    apiService.createIteration(requestParams, null)
      .subscribe(() => {},
      err => {
        expect(apiService.iterations.length).toEqual(0);
      });
  }));

  // it('Should check valid URL for iterations', () => {
  //   let url1 = 'http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/iterations';
  //   expect(apiService.checkValidIterationUrl(url1)).toEqual(true);
  //   let url2 = 'http://localhost:8080/api/spaces/d7d98b45-415a-4cfc-add2-ec7b7aee7dd5/invalid';
  //   expect(apiService.checkValidIterationUrl(url2)).toEqual(false);
  //   let url3 = 'http://localhost:8080/api/spaces/415a-4cfc-add2-ec7b7aee7dd5/invalid';
  //   expect(apiService.checkValidIterationUrl(url3)).toEqual(false);
  // });

  // Patch service test
  it('Update iteration', async(() => {
    // Assign the existing iteration value
    apiService.iterations = cloneDeep(resp);

    // Set the request params with updated name
    let requestParams = cloneDeep(resp[0]);
    requestParams.attributes.name = 'New Name';

    // Prepare the mock service and response
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: { data: requestParams },
          status: 200
        })
      ));
    });

    apiService.updateIteration(requestParams)
      .subscribe(data => {
        console.log(apiService.iterations);
        expect(apiService.iterations[0].attributes.name).toEqual('New Name');
      });
  }));

  // Patch service test with API error
  it('Update iteration with API error', async(() => {
    // Assign the existing iteration value
    apiService.iterations = cloneDeep(resp);

    // Set the request params with updated name
    let requestParams = cloneDeep(resp[0]);
    requestParams.attributes.name = 'New Name';

    // Prepare the mock service and response
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: {},
          status: 404
        })
      ));
    });

    apiService.updateIteration(requestParams)
      .subscribe(() => {},
      data => {
        expect(apiService.iterations[0].attributes.name).toEqual('Sprint #24');
      });
  }));

});
*/
