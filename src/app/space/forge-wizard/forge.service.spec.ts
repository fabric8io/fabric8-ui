import { TestBed } from '@angular/core/testing';
import { Response, ResponseOptions, XHRBackend, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AuthenticationService } from 'ngx-login-client';
import { ForgeService } from './forge.service';
import { FABRIC8_FORGE_API_URL } from '../../../a-runtime-console/shared/fabric8-forge-api';
import {
  commandInfoExpectedResponse, executeInput, executeOutput, inputForPost, nextStepExpectedResponse,
  nextStepInput
} from './forge.service.mock';

import { History} from './history.component';
import { Gui} from './gui.model';

describe('Forge Service:', () => {
  let mockService: MockBackend;
  let forgeService: ForgeService;
  let mockAuthenticationService;

  beforeEach(() => {
    mockAuthenticationService = jasmine.createSpyObj('AuthenticationService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: XHRBackend, useClass: MockBackend
        },
        {
          provide: AuthenticationService,
          useValue: mockAuthenticationService
        },
        {
          provide: FABRIC8_FORGE_API_URL,
          useValue: 'http://some.url'
        },
        ForgeService
      ]
    });
    forgeService = TestBed.get(ForgeService);
    mockService = TestBed.get(XHRBackend);
  });

  it('Get commandInfo successfully', () => {
    // given
    mockAuthenticationService.getToken.and.returnValue('SSO_TOKEN');
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(commandInfoExpectedResponse),
          status: 200
        })
      ));
    });
    // when
    forgeService.commandInfo('git-import-wizard').then((data: any) => {
      // then
      expect(data).toEqual(commandInfoExpectedResponse);
    });
  });

  it('Get commandInfo in error of type Error', () => {
    // given
    mockAuthenticationService.getToken.and.returnValue('SSO_TOKEN');
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });
    // when
    forgeService.commandInfo('git-import-wizard').then((data: any) => {
        fail('Get commandInfo in error');
      }, // then
      error => expect(error.name).toEqual('some error'));
  });


  it('Post nextStep successfully', () => {
    // given
    mockAuthenticationService.getToken.and.returnValue('SSO_TOKEN');
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(nextStepExpectedResponse),
          status: 200
        })
      ));
    });
    let h = new History();
    h.state = nextStepInput.state;
    h.ready = nextStepInput.ready;
    // when
    forgeService.nextStep('git-import-wizard', h).then((data: any) => {
      // then
      expect(data).toEqual(nextStepExpectedResponse);
    });
  });

  it('Post nextStep in error of type Error', () => {
    // given
    mockAuthenticationService.getToken.and.returnValue('SSO_TOKEN');
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });
    let h = new History();
    h.state = nextStepInput.state;
    h.ready = nextStepInput.ready;
    // when
    forgeService.nextStep('git-import-wizard', h).then((data: any) => {
        fail('Post nextStep in error');
      }, // then
      error => expect(error.name).toEqual('some error'));
  });

  it('Post executeStep successfully', () => {
    // given
    mockAuthenticationService.getToken.and.returnValue('SSO_TOKEN');
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(executeOutput),
          status: 200
        })
      ));
    });
    let h = new History();
    h.state = executeInput.state;
    h.ready = executeInput.ready;
    // when
    forgeService.executeStep('git-import-wizard', h).then((data: any) => {
      // then
      expect(data).toEqual(executeOutput);
    });
  });

  it('Post executeStep in error of type Error', () => {
    // given
    mockAuthenticationService.getToken.and.returnValue('SSO_TOKEN');
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });
    let h = new History();
    h.state = executeInput.state;
    h.ready = executeInput.ready;
    // when
    forgeService.executeStep('git-import-wizard', h).then((data: any) => {
        fail('Post executeStep in error');
      }, // then
      error => expect(error.name).toEqual('some error'));
  });

  it('Post successfully', () => {
    // given
    mockAuthenticationService.getToken.and.returnValue('SSO_TOKEN');
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(nextStepExpectedResponse),
          status: 200
        })
      ));
    });
    let gui = new Gui();
    gui.inputs = [{
      'name': 'gitOrganisation',
      'shortName': ' ',
      'valueType': 'io.fabric8.forge.generator.git.GitOrganisationDTO',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': true,
      'deprecated': false,
      'label': 'Organisation',
      'valueChoices': [],
      'description': '',
      'class': 'UISelectOne',
      'value': 'corinnekrych'
    }];
    // when
    forgeService.post(gui, 'action').then((data: any) => {
      // then
      expect(data).toEqual(nextStepExpectedResponse);
    });
  });

  it('Load GUI for init', () => {
    // given
    mockAuthenticationService.getToken.and.returnValue('SSO_TOKEN');
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(commandInfoExpectedResponse),
          status: 200
        })
      ));
    });
    let h = new History();
    h.state = [];
    h.ready = true;
    // when
    forgeService.loadGui('git-import-wizard', h).then((data: any) => {
      // then
      expect(data).toEqual(commandInfoExpectedResponse);
    });
  });

  it('Load GUI for next', () => {
    // given
    mockAuthenticationService.getToken.and.returnValue('SSO_TOKEN');
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(nextStepExpectedResponse),
          status: 200
        })
      ));
    });
    let h = new History();
    h.state = nextStepInput.state;
    h.ready = true;
    // when
    forgeService.loadGui('git-import-wizard', h).then((data: any) => {
      // then
      expect(data).toEqual(nextStepExpectedResponse);
    });
  });
});
