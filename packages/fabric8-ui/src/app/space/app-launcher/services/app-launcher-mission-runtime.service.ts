import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Catalog, HelperService, MissionRuntimeService } from 'ngx-launcher';
import { AuthenticationService } from 'ngx-login-client';
import { Observable, throwError as observableThrowError, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { FeatureTogglesService } from 'ngx-feature-flag';

@Injectable()
export class AppLauncherMissionRuntimeService extends MissionRuntimeService {
  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private END_POINT: string = '';
  private API_BASE: string = 'booster-catalog/';
  private ORIGIN: string = '';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private featureToggleService: FeatureTogglesService,
    private helperService: HelperService,
  ) {
    super();
    this.END_POINT = this.helperService.getBackendUrl();
    this.ORIGIN = this.helperService.getOrigin();
    if (this.auth.getToken() != null) {
      this.headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
  }

  getCatalog(): Observable<Catalog> {
    if (this.ORIGIN) {
      this.headers = this.headers.set('X-App', this.ORIGIN);
    }
    return forkJoin(
      this.featureToggleService.isFeatureUserEnabled('AppLauncher.NodeBooster'),
      this.featureToggleService.isFeatureUserEnabled('AppLauncher.GoLangBooster'),
    ).pipe(
      switchMap(([nodeFlag, goLangFlag]) => {
        return this.http
          .get<Catalog>(this.END_POINT + this.API_BASE, { headers: this.headers })
          .pipe(
            map((catalog: Catalog) => {
              if (!nodeFlag) {
                catalog.boosters = catalog.boosters.filter((b) => b.runtime !== 'nodejs');
                catalog.runtimes = catalog.runtimes.filter((r) => r.id !== 'nodejs');
              }
              if (!goLangFlag) {
                catalog.boosters = catalog.boosters.filter((b) => b.runtime !== 'golang');
                catalog.runtimes = catalog.runtimes.filter((r) => r.id !== 'golang');
              }
              return catalog;
            }),
            catchError(this.handleError),
          );
      }),
    );
  }

  private handleError(error: HttpErrorResponse | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof HttpResponse) {
      const body = error.body || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return observableThrowError(errMsg);
  }
}
