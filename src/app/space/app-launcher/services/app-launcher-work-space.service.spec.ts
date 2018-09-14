import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { WorkspaceLinks } from './../../create/codebases/services/workspace';
import { AppLaunchWorkSpaceService } from './app-launcher-work-space.service';

describe('AppLaunchWorkSpaceService: ', () => {
  const mockCreateWorkSpace: WorkspaceLinks = {
    links: {
      open: 'https://che.openshift.io/viraj-1/sep-3-app-irtde'
    }
  };

  const mockAppLaunchWorkSpaceService = {
    createWorkSpace(): Observable<WorkspaceLinks> {
      return Observable.of(mockCreateWorkSpace);
    }
  };

  let appLaunchWorkSpaceService: AppLaunchWorkSpaceService;

  beforeEach(() => {
    appLaunchWorkSpaceService = TestBed.get(AppLaunchWorkSpaceService);
    TestBed.configureTestingModule({
      providers: [
        {provide: AppLaunchWorkSpaceService, useClass: mockAppLaunchWorkSpaceService}
      ]
    });
  });

  it('Create workSpace', async () => {
    appLaunchWorkSpaceService.createWorkSpace('').subscribe((val: WorkspaceLinks) => {
      expect(val).toEqual(mockCreateWorkSpace);
    });
  });
});
