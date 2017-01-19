import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { cloneDeep } from 'lodash';

import { AuthenticationService } from '../../auth/authentication.service';
import { Logger } from '../../shared/logger.service';
import { Space } from '../../models/space';
import { SpaceService } from './space.service';

describe('Service: SpaceService', () => {

  let spaceService: SpaceService;
  let mockService: MockBackend;
  let fakeAuthService: any;

  beforeEach(() => {
    fakeAuthService = {
      getToken: function () {
        return '';
      },
      isLoggedIn: function () {
        return true;
      }
    };
    TestBed.configureTestingModule({
      providers: [
        Logger,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend,
            options: BaseRequestOptions) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AuthenticationService,
          useValue: fakeAuthService
        },
        SpaceService
      ]
    });
  });

  beforeEach(inject(
    [SpaceService, MockBackend],
    (service: SpaceService, mock: MockBackend) => {
      spaceService = service;
      mockService = mock;
    }
  ));

  let responseData: Space[] = [
    {
      name: 'TestSpace',
      path: 'testspace',
      description: 'This is a space for unit test',
      teams: [],
      defaultTeam: null,
      'attributes': {
        'name': 'TestSpace',
        'created-at': null,
        'updated-at': null,
        'version': 0
      },
      'id': '1',
      'type': 'spaces'
    }
  ];
  let response = { data: responseData, links: {} };
  let expectedResponse = cloneDeep(responseData);


  it('Get spaces', async(() => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(response),
          status: 200
        })
      ));
    });

    spaceService.getSpaces().then(data => {
      expect(data).toEqual(expectedResponse);
    });
  }));

  it('Add new space', async(() => {
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify({data: responseData[0]}),
          status: 201
        })
      ));
    });

    spaceService.create(responseData[0])
      .then(data => {
        expect(data).toEqual(expectedResponse[0]);
      });
  }));

});
