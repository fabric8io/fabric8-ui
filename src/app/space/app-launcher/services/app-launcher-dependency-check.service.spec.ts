import { TestBed } from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import {
    DependencyCheck
} from 'ngx-forge';

import { AppLauncherDependencyCheckService } from './app-launcher-dependency-check.service';


function initTestBed() {
  TestBed.configureTestingModule({
    imports: [HttpModule],
    providers: [
        AppLauncherDependencyCheckService,
        {
            provide: XHRBackend, useClass: MockBackend
        }
    ]
  });
}

describe('Service: AppLauncherDependencyCheckService', () => {
  let appLauncherDependencyCheckService: AppLauncherDependencyCheckService;
  let mockService: MockBackend;
  let dependencyCheck = {
    mavenArtifact: 'booster-mission-runtime',
    groupId: 'io.openshift.booster',
    projectName: 'app-test-1',
    projectVersion: '1.0.0',
    spacePath: '/myspace'
  } as DependencyCheck;

  beforeEach(() => {
    initTestBed();
    appLauncherDependencyCheckService = TestBed.get(AppLauncherDependencyCheckService);
    mockService = TestBed.get(XHRBackend);
  });

  it('Get project dependencies', () => {
    mockService.connections.subscribe((connection: any) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: JSON.stringify(dependencyCheck),
            status: 200
          })
        ));
    });
    appLauncherDependencyCheckService.getDependencyCheck().subscribe((val) => {
        expect(val).toEqual(dependencyCheck);
    });
  });

  it('validate Project Name to be truthy', () => {
    let valProjectName = appLauncherDependencyCheckService.validateProjectName(dependencyCheck.projectName);
    expect(valProjectName).toBeTruthy();
  });

  it('validate Project Name to be falsy', () => {
    let valProjectName = appLauncherDependencyCheckService.validateProjectName('#app-test-1');
    expect(valProjectName).toBeFalsy();
  });

  it('validate Project Name to be falsy as length is not satisfied', () => {
    let valProjectName = appLauncherDependencyCheckService.validateProjectName('ap');
    expect(valProjectName).toBeFalsy();
  });

  it('validate Artifact Id to be truthy', () => {
    let valArtifactId = appLauncherDependencyCheckService.validateArtifactId(dependencyCheck.mavenArtifact);
    expect(valArtifactId).toBeTruthy();
  });

  it('validate Artifact Id to be falsy', () => {
    let valArtifactId = appLauncherDependencyCheckService.validateArtifactId('booster.mission-runtime');
    expect(valArtifactId).toBeFalsy();
  });

  it('validate Artifact Id to be falsy as length is not satisfied', () => {
    let valArtifactId = appLauncherDependencyCheckService.validateArtifactId('bo');
    expect(valArtifactId).toBeFalsy();
  });

  it('validate GroupId to be truthy', () => {
    let valGroupId = appLauncherDependencyCheckService.validateGroupId(dependencyCheck.groupId);
    expect(valGroupId).toBeTruthy();
  });

  it('validate GroupId to be falsy', () => {
    let valGroupId = appLauncherDependencyCheckService.validateGroupId('io.openshift-booster');
    expect(valGroupId).toBeFalsy();
  });

  it('validate GroupId to be falsy as length is not satisfied', () => {
    let valGroupId = appLauncherDependencyCheckService.validateGroupId('io');
    expect(valGroupId).toBeFalsy();
  });

  it('validate ProjectVersion to be truthy', () => {
    let valProjectVersion = appLauncherDependencyCheckService.validateProjectVersion(dependencyCheck.projectVersion);
    expect(valProjectVersion).toBeTruthy();
  });

  it('validate ProjectVersion to be falsy', () => {
    let valProjectVersion = appLauncherDependencyCheckService.validateProjectVersion('#v.1-0-$');
    expect(valProjectVersion).toBeFalsy();
  });

  it('validate ProjectVersion to be falsy as length is not satisfied', () => {
    let valProjectVersion = appLauncherDependencyCheckService.validateProjectVersion('v.');
    expect(valProjectVersion).toBeFalsy();
  });

});
