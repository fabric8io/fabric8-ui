import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
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
      return of(mockCreateWorkSpace);
    }
  };

  let appLaunchWorkSpaceService: AppLaunchWorkSpaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: AppLaunchWorkSpaceService, useValue: mockAppLaunchWorkSpaceService}
      ]
    });
    appLaunchWorkSpaceService = TestBed.get(AppLaunchWorkSpaceService);
  });

  it('Create workSpace', async () => {
    appLaunchWorkSpaceService.createWorkSpace('').subscribe((val: WorkspaceLinks) => {
      expect(val).toEqual(mockCreateWorkSpace);
    });
  });
});
