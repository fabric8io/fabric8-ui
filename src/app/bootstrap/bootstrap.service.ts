import { Injectable } from '@angular/core';

import { Broadcaster } from 'ngx-base';
import { OAuthConfigStore } from '../../a-runtime-console';
import { Observable} from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class BootstrapService {

  constructor(
    private readonly broadcaster: Broadcaster,
    private readonly oauthConfig: OAuthConfigStore
  ) { }

  public bootstrap(): Promise<any> {
    const subj: Observable<boolean>  = this.oauthConfig.loading;
    const oauthLoading = subj.pipe(first(val => val === false));
    return oauthLoading.toPromise();
  }
}
