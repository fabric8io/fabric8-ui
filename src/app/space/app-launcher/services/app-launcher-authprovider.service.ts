import { Injectable } from '@angular/core';

import { AuthHelperService } from 'ngx-forge';

@Injectable()
export class AuthAPIProvider extends AuthHelperService {

  constructor(private apiUrl: string) {
    super();
  }

  getAuthApiURl(): any {
    return this.apiUrl;
  }
}
