import { TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import { AppGeneratorConfiguratorService } from './app-generator.service';
import { Observable } from 'rxjs';
import { context, choice, source } from './fabric8-app-generator-configurator.service.mock';

describe('Fabric8AppGeneratorConfigurator:', () => {
  let mockContext: any;
  let mockLog: any;
  let appGeneratorConfiguratorService: AppGeneratorConfiguratorService
  beforeEach(() => {
    mockLog = jasmine.createSpyObj('Logger', ['createLoggerDelegate']);
    mockContext = jasmine.createSpy('mockContext');
  });

  it('Format  mardown to Html', () => {
    // given
    mockLog.createLoggerDelegate.and.returnValue(() => { });
    mockContext.current = Observable.of(context);
    appGeneratorConfiguratorService = new AppGeneratorConfiguratorService(mockLog, mockContext);
    choice.description = "To start with...";
    source[0].descriptionMarkdown = "Maven based pipeline which:\n\n* creates a new version then builds and deploys the project into the maven repository\n* runs an integration test in the **Test** environment\n";
    let expectedChoice = {
      "index": 0,
      "description": "<p>Maven based pipeline which:</p>\n<ul>\n<li>creates a new version then builds and deploys the project into the maven repository</li>\n<li>runs an integration test in the <strong>Test</strong> environment</li>\n</ul>\n",
    }

    // when
    appGeneratorConfiguratorService.formatHtml(choice, source, 0);

    // then: choice get assigned source.descriptionMarkdown translates from markdown to html
    expect(choice.description).toEqual(expectedChoice.description);
  });

});
