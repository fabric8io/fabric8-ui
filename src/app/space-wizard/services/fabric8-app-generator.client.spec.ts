import { TestBed } from '@angular/core/testing';
import { Http, Response, ResponseOptions, XHRBackend, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AuthenticationService, UserService, AUTH_API_URL } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { Fabric8AppGeneratorClient } from './fabric8-app-generator.client';
import { Fabric8AppGeneratorService } from './fabric8-app-generator.service';
import { CodebasesService } from '../../space/create/codebases/services/codebases.service';
import {
  IAppGeneratorCommand,
  IAppGeneratorPair,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IAppGeneratorService,
  IAppGeneratorServiceProvider,
  IAppGeneratorState,
  IFieldCollection,
  IAppGeneratorMessage,
  AppGeneratorConfiguratorService
} from '../services/app-generator.service';
import { Broadcaster, Notifications } from 'ngx-base';
import { cloneDeep } from 'lodash';
import { Space, SpaceAttributes } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { importWizardStep1_GitOrganisation_Validate, validate_Response, importWizardStep3_Jenkins_Validate } from './fabric8-app-generator.client.mock';

describe('Fabric8AppGeneratorClient:', () => {
  let mockAppGeneratorService: any;
  let mockCodebasesService: any;
  let mockAppGeneratorConfigurationService: any;
  let mockNotification: any;
  let mockBroadcaster: any;
  let mockLog: any;
  let fabric8AppGeneratorClient: Fabric8AppGeneratorClient;
  let space = {} as Space;

  beforeEach(() => {
    mockAppGeneratorService = jasmine.createSpyObj('Fabric8AppGeneratorService', ['getFields']);
    mockCodebasesService = jasmine.createSpyObj('CodebasesService', ['addCodebase']);
    mockAppGeneratorConfigurationService = {};
    mockNotification = jasmine.createSpy('Notifications');
    mockBroadcaster = jasmine.createSpyObj('Broadcaster', ['broadcast']);
    mockLog = jasmine.createSpyObj('Logger', ['createLoggerDelegate']);

    space.name = 'corinne';
    space.path = '/path/to/corinne';
    space.attributes = new SpaceAttributes();
    space.attributes.name = space.name;
    space.type = 'spaces';
    space.privateSpace = false;
    space.process = { name: 'scrum', description: 'full chaos' };
    space.relationships = {
      areas: {
        links: {
          related: ''
        }
      },
      iterations: {
        links: {
          related: ''
        }
      },
      ['owned-by']: {
        data: {
          id: 'c',
          type: 'identities'
        }
      }
    };
  });

  it('Add codebase delegate and run it', () => {
    // given
    const log = () => { };
    const codebaseReturned = {
      "attributes": {
        "createdAt": "2017-06-22T15:18:03.580005Z",
        "last_used_workspace": "",
        "stackId": "vert.x",
        "type": "git",
        "url": "https://github.com/corinnekrych/corinne-test-githubqqq.git"
      },
      "id": "5e9cce00-2fb4-47a0-a1b0-36ce5747103d",
      "links": {
        "edit": "https://api.openshift.io/api/codebases/5e9cce00-2fb4-47a0-a1b0-36ce5747103d/edit",
        "self": "https://api.openshift.io/api/codebases/5e9cce00-2fb4-47a0-a1b0-36ce5747103d"
      },
      "relationships": {
        "space": {
          "data": {
            "id": "22885ae0-a683-4f72-8610-f40744ab8168",
            "type": "spaces"
          },
          "links": {
            "self": "https://api.openshift.io/api/spaces/22885ae0-a683-4f72-8610-f40744ab8168"
          }
        }
      },
      "type": "codebases"
    };
    mockLog.createLoggerDelegate.and.returnValue(log);
    fabric8AppGeneratorClient = new Fabric8AppGeneratorClient(mockAppGeneratorService, mockCodebasesService, mockAppGeneratorConfigurationService, mockNotification, mockBroadcaster, mockLog);
    mockAppGeneratorConfigurationService.currentSpace = space;
    mockCodebasesService.addCodebase.and.returnValue(Observable.of(codebaseReturned))
    fabric8AppGeneratorClient.result = {
      "gitUrl": "https://github.com/corinnekrych/corinne-test-github777.git",
      "gitHtmlUrl": "https://github.com/corinnekrych/corinne-test-github777",
      "gitOwnerName": "corinnekrych",
      "organisationName": "corinnekrych",
      "repositoryName": "corinne-test-github777",
      "namespace": "ckrych",
      "buildConfigName": "corinne-test-github777",
      "cheStackId": "vert.x",
      "organisationJenkinsJobUrl": "https://jenkins-ckrych-jenkins.8a09.starter-us-east-2.openshiftapps.com/job/corinnekrych"
    };
    // when
    let delegate = fabric8AppGeneratorClient.getAddCodebaseDelegate();
    delegate().then(result => {
      // then
      expect(result.codebase.attributes.stackId).toEqual("vert.x");
      expect(result.codebase.attributes.url).toEqual("https://github.com/corinnekrych/corinne-test-githubqqq.git");
    },
      err => {
        fail("AddCodebaseDelegate fails" + err);
      })

  });

  it('Add multiple codebases', () => {
    // given
    const log = () => { };
    const codebaseReturned = {
      "attributes": {
        "createdAt": "2017-06-22T15:18:03.580005Z",
        "last_used_workspace": "",
        "type": "git",
        "url": "https://github.com/corinnekrych/corinne-test-githubqqq.git"
      },
      "id": "5e9cce00-2fb4-47a0-a1b0-36ce5747103d",
      "links": {
        "edit": "https://api.openshift.io/api/codebases/5e9cce00-2fb4-47a0-a1b0-36ce5747103d/edit",
        "self": "https://api.openshift.io/api/codebases/5e9cce00-2fb4-47a0-a1b0-36ce5747103d"
      },
      "relationships": {
        "space": {
          "data": {
            "id": "22885ae0-a683-4f72-8610-f40744ab8168",
            "type": "spaces"
          },
          "links": {
            "self": "https://api.openshift.io/api/spaces/22885ae0-a683-4f72-8610-f40744ab8168"
          }
        }
      },
      "type": "codebases"
    };
    mockLog.createLoggerDelegate.and.returnValue(log);
    fabric8AppGeneratorClient = new Fabric8AppGeneratorClient(mockAppGeneratorService, mockCodebasesService, mockAppGeneratorConfigurationService, mockNotification, mockBroadcaster, mockLog);
    mockAppGeneratorConfigurationService.currentSpace = space;
    mockCodebasesService.addCodebase.and.returnValue(Observable.of(codebaseReturned))
    fabric8AppGeneratorClient.result = {
      "namespace": null,
      "buildConfigName": "",
      "gitUrl": null,
      "cheStackId": null,
      "organisationJenkinsJobUrl": "https://jenkins-ckrych-jenkins.8a09.starter-us-east-2.openshiftapps.com/job/corinnekrych",
      "gitRepositoryNames": [
        "https://github.com/corinnekrych/A.git",
        "https://github.com/corinnekrych/AFOAuth2Client.git"
      ],
      "gitOwnerName": "corinnekrych",
      "warnings": []
    };
    // when
    let delegate = fabric8AppGeneratorClient.getAddCodebaseDelegate();
    delegate().then(result => {
      // then
      expect(result.codebase.attributes.url).toEqual("https://github.com/corinnekrych/corinne-test-githubqqq.git");
    },
      err => {
        fail("AddCodebaseDelegate fails" + err);
      })

  });

  it('Validate successfully called on first step of import repository wizard', (done) => {
    // given
    mockLog.createLoggerDelegate.and.returnValue(() => { });
    mockAppGeneratorService.getFields.and.returnValue(Observable.of(validate_Response));
    fabric8AppGeneratorClient = new Fabric8AppGeneratorClient(mockAppGeneratorService, mockCodebasesService, mockAppGeneratorConfigurationService, mockNotification, mockBroadcaster, mockLog);
    fabric8AppGeneratorClient._currentResponse = importWizardStep1_GitOrganisation_Validate;

    // when
    fabric8AppGeneratorClient.validate({ showProcessingIndicator: true }).then(() => {
      // then
      // no new fields added as this is the first validation call
      expect(fabric8AppGeneratorClient._currentResponse.context.validationCommand.parameters.fields.length)
        .toEqual(importWizardStep1_GitOrganisation_Validate.context.validationCommand.parameters.fields.length);
      // no merged fields
      expect(fabric8AppGeneratorClient._currentResponse.context.validationCommand.parameters.fields)
        .toEqual(importWizardStep1_GitOrganisation_Validate.context.validationCommand.parameters.fields);
      expect(fabric8AppGeneratorClient.processing).toBeFalsy();
      done();
    })
  });

  // Each validation should send all the fields since the beginning of the wizard flow.
  it('Validate successfully called on last step of import repository wizard', (done) => {
    // given
    mockLog.createLoggerDelegate.and.returnValue(() => { });
    mockAppGeneratorService.getFields.and.returnValue(Observable.of(validate_Response));
    fabric8AppGeneratorClient = new Fabric8AppGeneratorClient(mockAppGeneratorService, mockCodebasesService, mockAppGeneratorConfigurationService, mockNotification, mockBroadcaster, mockLog);
    fabric8AppGeneratorClient._currentResponse = cloneDeep(importWizardStep3_Jenkins_Validate);

    // when
    fabric8AppGeneratorClient.validate({ showProcessingIndicator: true }).then(() => {
      // then
      // no new fields added as this is the first validation call
      expect(fabric8AppGeneratorClient._currentResponse.context.validationCommand.parameters.fields.length)
        .toEqual(importWizardStep3_Jenkins_Validate.context.validationCommand.parameters.fields.length);
      // validatedData got merged into fields
      expect(fabric8AppGeneratorClient._currentResponse.context.validationCommand.parameters.fields[1].value)
        .not.toEqual(importWizardStep3_Jenkins_Validate.context.validationCommand.parameters.fields[1].value as any);
      expect(fabric8AppGeneratorClient.processing).toBeFalsy();
      done();
    })
  });

  it('Format the returned result from Forge', () => {
    // given
    mockLog.createLoggerDelegate.and.returnValue(() => { });
    let result = {
      "namespace": null,
      "buildConfigName": "",
      "gitUrl": null,
      "cheStackId": null,
      "organisationJenkinsJobUrl": "https://jenkins-ckrych-jenkins.8a09.starter-us-east-2.openshiftapps.com/job/corinnekrych",
      "gitRepositoryNames": [
        "https://github.com/corinnekrych/A.git",
        "https://github.com/corinnekrych/AFOAuth2Client.git"
      ],
      "gitOwnerName": "corinnekrych",
      "warnings": []
    };
    fabric8AppGeneratorClient = new Fabric8AppGeneratorClient(mockAppGeneratorService, mockCodebasesService, mockAppGeneratorConfigurationService, mockNotification, mockBroadcaster, mockLog);

    // when
    let msg = fabric8AppGeneratorClient.formatForDisplay(result);
    expect(msg).toEqual(`
<div class="form-group"><label class="col-sm-5 property-name property-name-result" >Git owner name</label><span class="col-sm-7 property-value property-value-result">corinnekrych</span></div>
<div class="form-group"><label class="col-sm-5 property-name property-name-result" >Git repository names</label><a class="col-sm-7 property-value property-value-result property-value-link" target="_blank" href="https://github.com/corinnekrych/A.git" >https://github.com/corinnekrych/A.git</a><a class="col-sm-7 property-value property-value-result property-value-link" target="_blank" href="https://github.com/corinnekrych/AFOAuth2Client.git" >https://github.com/corinnekrych/AFOAuth2Client.git</a></div>
<div class="form-group"><label class="col-sm-5 property-name property-name-result" >Organisation jenkins job url</label><a class="col-sm-7 property-value property-value-result property-value-link" target="_blank" href="https://jenkins-ckrych-jenkins.8a09.starter-us-east-2.openshiftapps.com/job/corinnekrych" >https://jenkins-ckrych-jenkins.8a09.starter-us-east-2.openshiftapps.com/job/corinnekrych</a></div>`);
  })

});
