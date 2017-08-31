import {async, TestBed} from '@angular/core/testing';
const Pact = require('pact-web');
//let pact = require('@pact-foundation/pact-node');

import { step_1_1_response } from './forge-wizard.api.mock';
import {HttpModule} from "@angular/http";
import {Fabric8ForgeService} from "./fabric8-forge.service";
import {LoggerFactory} from "../common/logger";
import {AuthenticationService} from "ngx-login-client";
import {ApiLocatorService} from "../../../shared/api-locator.service";

describe('Forge API tests:', () => {

  let provider = Pact({ consumer: 'AppGeneratorWizard', provider: 'ForgeGenerator', web: true });
  let mockLog: any;
  let fabric8ForgeService: Fabric8ForgeService;
  let mockAuthService: any;
  let mockApiLocatorService: any;

  beforeAll(done => {

    provider.addInteraction({
      state: 'It works',
      uponReceiving: 'a request for forge step 1 - init',
      withRequest: {
        method: 'GET',
        path: '/forge/commands/fabric8-import-git'
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: step_1_1_response
      }
    }).then(() => done(), function(err) { console.log('failed'); done.fail(err); });
  });

  afterAll(done => {
    provider.writePact()
      .then(function() { done(); }, function(err) { console.log('failed'); done.fail(err); });
  });


  beforeEach(function() {
    mockLog = jasmine.createSpyObj('Logger', ['createLoggerDelegate']);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken', 'isLoggedIn']);
    mockApiLocatorService = jasmine.createSpyObj('ApiLocatorService', ['forgeApiUrl']);
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: LoggerFactory, useValue: mockLog
        },
        {
          provide: AuthenticationService,
          useValue: mockAuthService
        },
        {
          provide: ApiLocatorService,
          useValue: mockApiLocatorService
        },
        Fabric8ForgeService
      ]
    });
    fabric8ForgeService = TestBed.get(Fabric8ForgeService);
  });

  it('Step1 - init - import wizard: GET command successfully', () => {
    // given
    const log = () => { };
    mockLog.createLoggerDelegate.and.returnValue(log);
    mockAuthService.getToken.and.returnValue('SSO_TOKEN');
    mockAuthService.isLoggedIn.and.returnValue(true);
    console.log('1. start');
    // when
    fabric8ForgeService.GetCommand('http://localhost:1234/forge/commands/fabric8-import-git').subscribe((data: any) => {
      // then
      console.log('2');
      expect(data.payload.data).toEqual('boo');
    });

  });

});

