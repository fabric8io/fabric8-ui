import { Inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Config } from 'ngx-forge';
import { FABRIC8_FORGE_API_URL } from '../../../../a-runtime-console/shared/fabric8-forge-api';

@Injectable()
export class ForgeConfig extends Config {

  constructor(@Inject(FABRIC8_FORGE_API_URL) private apiUrl: string) {
    super();
    let settings = {backend_url: 'TO_BE_DEFINED'};

    if (apiUrl) {
      settings['backend_url'] = Location.stripTrailingSlash(apiUrl) + '/api/launchpad';
    }

    this.settings = settings;
  }
}
