import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
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
      return Observable.of(mockCheState);
    }
  };

  let appLaunchCheService: AppLaunchCheService;

  beforeEach(() => {
    appLaunchCheService = TestBed.get(AppLaunchCheService);
    TestBed.configureTestingModule({
      providers: [
        { provide: AppLaunchCheService, useClass: mockAppLauncherCheService }
      ]
    });
  });

  it('Get che state', async () => {
    appLaunchCheService.getState().subscribe((val: Che) => {
      expect(val).toEqual(mockCheState);
    });
  });
});
