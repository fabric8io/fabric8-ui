import { Injectable } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { first } from 'rxjs/operators';
import { OAuthConfigStore } from '../../a-runtime-console/index';

@Injectable()
export class BootstrapService {
  constructor(
    private readonly broadcaster: Broadcaster,
    private readonly oauthConfig: OAuthConfigStore,
  ) {}

  public bootstrap(): Promise<any> {
    let oauthLoading = this.oauthConfig.loading.pipe(first((val) => val === false)).toPromise();
    return oauthLoading;
  }
}
