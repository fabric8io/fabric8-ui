import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CheService as LauncherCheService } from 'ngx-launcher';
import { Che } from './../../create/codebases/services/che';
import { CheService } from './../../create/codebases/services/che.service';

@Injectable()
export class AppLaunchCheService implements LauncherCheService {

  constructor(private cheService: CheService) {}

  /**
  * Get state of Che server
  *
  * @returns {Observable<Che>}
  */
  getState(): Observable<Che> {
    return this.cheService.getState();
  }
}
