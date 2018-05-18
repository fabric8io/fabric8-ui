import { TestBed } from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';

import {
    DependencyCheck
} from 'ngx-forge';

import { DeploymentApiService } from '../../create/deployments/services/deployment-api.service';
import { AppLauncherDependencyCheckService } from './app-launcher-dependency-check.service';

let mockDeploymentApiService: any = {
  getApplications(): Observable<any[]> {
      return Observable.of([{
          attributes: {name: 'app-apr-10-2018-4-25'}
      }, {
          attributes: {name: 'app-may-11-2018'}
      }, {
          attributes: {name: 'app-may-14-1-04'}
      }]);
  }
};

function initTestBed() {
  TestBed.configureTestingModule({
    imports: [HttpModule],
    providers: [
        AppLauncherDependencyCheckService,
        {
            provide: XHRBackend, useClass: MockBackend
        },
        { provide: DeploymentApiService, useValue: mockDeploymentApiService }
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
    let valProjectName = appLauncherDependencyCheckService.validateProjectName('app-apr_10');
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

  it('validate Project Name to be falsy as length is not satisfied', () => {
    let valProjectName = appLauncherDependencyCheckService.validateProjectName('12345678901234567890123456789012345678901');
    expect(valProjectName).toBeFalsy();
  });

  it('validate Project Name to be truthy as length is satisfied', () => {
    let valProjectName = appLauncherDependencyCheckService.validateProjectName('1234567890123456789012345678901234567890');
    expect(valProjectName).toBeTruthy();
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
