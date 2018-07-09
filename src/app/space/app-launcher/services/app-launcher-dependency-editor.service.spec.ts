import { TestBed } from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';

import { Context } from 'ngx-fabric8-wit';
import {
    Config,
    HelperService,
    TokenProvider,
    URLProvider
} from 'ngx-forge';

import { FABRIC8_FORGE_API_URL } from '../../../shared/runtime-console/fabric8-ui-forge-api';
import { DeploymentApiService } from '../../create/deployments/services/deployment-api.service';
import { NewForgeConfig } from '../shared/new-forge.config';
import { AppLauncherDependencyEditorService } from './app-launcher-dependency-editor.service';

function initTestBed() {
  TestBed.configureTestingModule({
    imports: [HttpModule],
    providers: [
        AppLauncherDependencyEditorService,
        HelperService,
        TokenProvider,
        URLProvider,
        { provide: Config, useClass: NewForgeConfig },
        { provide: FABRIC8_FORGE_API_URL, useValue: 'url-here' },
        { provide: XHRBackend, useClass: MockBackend }
    ]
  });
}

describe('Service: AppLauncherDependencyCheckService', () => {
  let appLauncherDependencyEditorService: AppLauncherDependencyEditorService;
  let mockService: MockBackend;
  let depSample = {
    '_resolved': [
        {
            'package': 'io.vertx:vertx-core',
            'version': '3.5.0'
        },
        {
            'package': 'io.vertx:vertx-unit',
            'version': '3.5.0'
        }
    ],
    'ecosystem': 'maven',
    'request_id': '602af58786db4539b8c23f398c79f281'
};

  beforeEach(() => {
    initTestBed();
    appLauncherDependencyEditorService = TestBed.get(AppLauncherDependencyEditorService);
    mockService = TestBed.get(XHRBackend);
  });

  it('Get core dependencies', () => {
    mockService.connections.subscribe((connection: any) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: JSON.stringify(depSample),
            status: 200
          })
        ));
    });
    appLauncherDependencyEditorService.getCoreDependencies('vertx').subscribe((val) => {
        expect(val).toEqual(depSample);
    });
  });

});
