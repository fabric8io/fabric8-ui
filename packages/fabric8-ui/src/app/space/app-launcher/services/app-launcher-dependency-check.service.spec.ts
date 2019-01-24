import { TestBed } from '@angular/core/testing';
import { Context } from 'ngx-fabric8-wit';
import { DependencyCheck } from 'ngx-launcher';
import { Observable, of as observableOf } from 'rxjs';
import { ContextService } from '../../../shared/context.service';
import { AppLauncherDependencyCheckService } from './app-launcher-dependency-check.service';

let mockDeploymentApiService: any = {
  getApplications(): Observable<any[]> {
    return observableOf([]);
  },
};

function initTestBed() {
  TestBed.configureTestingModule({
    providers: [
      AppLauncherDependencyCheckService,
      { provide: ContextService, useClass: mockContextService },
    ],
  });
}

let mockContext = {
  name: 'my-space-apr24-4-43',
  path: '/user/my-space-apr24-4-43',
  space: {
    id: 'c814a58b-6220-4670-80cf-a2196899a59d',
    attributes: {
      'created-at': '2018-04-24T11:15:59.164872Z',
      description: '',
      name: 'my-space-apr24-4-43',
      'updated-at': '2018-04-24T11:15:59.164872Z',
      version: 0,
    },
  },
} as Context;

class mockContextService {
  get current(): Observable<Context> {
    return observableOf(mockContext);
  }
}

describe('Service: AppLauncherDependencyCheckService', () => {
  let service: AppLauncherDependencyCheckService;
  let dependencyCheck = {
    mavenArtifact: 'booster-mission-runtime',
    groupId: 'io.openshift.booster',
    projectName: '',
    projectVersion: '1.0.0',
    spacePath: '/c814a58b-6220-4670-80cf-a2196899a59d',
    targetEnvironment: 'os',
  } as DependencyCheck;

  beforeEach(() => {
    initTestBed();
    service = TestBed.get(AppLauncherDependencyCheckService);
  });

  it('Get project dependencies', (done: DoneFn) => {
    service.getDependencyCheck().subscribe((val) => {
      expect(val).toEqual(dependencyCheck);
      done();
    });
  });
});
