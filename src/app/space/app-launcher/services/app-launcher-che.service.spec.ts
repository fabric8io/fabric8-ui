import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Che } from './../../create/codebases/services/che';
import { AppLaunchCheService } from './app-launcher-che.service';

describe('AppLaunchCheService: ', () => {
  const mockCheState: Che = {
    clusterFull: false,
    multiTenant: true,
    running: true
  };

  const mockAppLauncherCheService = {
    getState(): Observable<Che> {
      return of(mockCheState);
    }
  };

  let appLaunchCheService: AppLaunchCheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AppLaunchCheService, useValue: mockAppLauncherCheService }
      ]
    });
    appLaunchCheService = TestBed.get(AppLaunchCheService);
  });

  it('Get che state', async () => {
    appLaunchCheService.getState().subscribe((val: Che) => {
      expect(val).toEqual(mockCheState);
    });
  });
});
