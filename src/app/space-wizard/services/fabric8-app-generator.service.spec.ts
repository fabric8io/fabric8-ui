import { TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import { Fabric8AppGeneratorService } from './fabric8-app-generator.service';
import { errorForExecuteForgeCommandError, expectedErr, mockService } from './fabric8-app-generator.service.mock'

describe('Fabric8AppGeneratorService:', () => {
  let mockAppGeneratorService: any;
  let mockAppGeneratorConfigurationService: any;
  let mockLog: any;
  let fabric8AppGeneratorService: Fabric8AppGeneratorService;
  let mockApiLocator: any;

  beforeEach(() => {
    mockAppGeneratorService = jasmine.createSpy('Fabric8AppGeneratorService');
    mockAppGeneratorConfigurationService = {};
    mockLog = jasmine.createSpyObj('Logger', ['createLoggerDelegate']);
    mockApiLocator = {
      ssoApiUrl: "ssoUrl",
      realm: "real"
    };
  });

  it('Execute returns with a Forge error', () => {
    // given
    mockLog.createLoggerDelegate.and.returnValue(() => { });
    let request = {
      "command": {
        "name": "forge-quick-start"
      }
    };
    fabric8AppGeneratorService = new Fabric8AppGeneratorService(mockService, mockLog, mockAppGeneratorConfigurationService, mockApiLocator);

    // when
    fabric8AppGeneratorService.executeForgeCommand(request).subscribe(() => {
    }, err => {
      // then
      expect(err).toEqual(expectedErr);
    })
  });

});
