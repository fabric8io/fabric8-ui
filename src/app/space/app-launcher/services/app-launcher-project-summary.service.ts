import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProjectSummaryService, Summary } from 'ngx-forge';

@Injectable()
export class AppLauncherProjectSummaryService implements ProjectSummaryService {
  constructor() {
  }

  /**
   * Set up the project for the given summary
   *
   * @param {Summary} summary The project summary
   * @returns {Observable<boolean>}
   */
  setup(summary: Summary): Observable<boolean> {
    return Observable.of(true);
  }

  /**
   * Verify the project for the given summary
   *
   * @param {Summary} summary The project summary
   * @returns {Observable<boolean>}
   */
  verify(summary: Summary): Observable<boolean> {
    return Observable.of(true);
  }
}
