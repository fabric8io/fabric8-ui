import { Injectable } from '@angular/core';

@Injectable()
export class ApiLocatorService {

  readonly DEFAULT_API_ENV_VAR_NAMES = new Map<string, string>(
    [
      ['wit', 'FABRIC8_WIT_API_URL'],
      ['recommender', 'FABRIC8_RECOMMENDER_API_URL']
    ]
  );

  readonly DEFAULT_API_PREFIXES = new Map<string, string>([
    ['wit', 'api'],
    ['recommender', 'recommender']
  ]);

  readonly DEFAULT_API_PATHS = new Map<string, string>([
    ['wit', '/api']
  ]);

  private envVars = new Map<string, string>();

  constructor() {
    this.DEFAULT_API_ENV_VAR_NAMES.forEach((value, key) => {
      this.loadEnvVar(key);
    });
  }

  get witApiUrl(): string {
    return this.buildApiUrl('wit');
  }

  get recommenderApiUrl(): string {
    return this.buildApiUrl('recommender')
  }

  private loadEnvVar(key: string): void {
    this.envVars.set(key, process.env[this.DEFAULT_API_ENV_VAR_NAMES.get(key)]);
  }

  private buildApiUrl(key: string): string {
    // Return any environment specified URLs for this API
    if (this.envVars.get(key)) {
      return this.envVars.get(key);
    }
    // Simple check to trim www
    let domainname = window.location.hostname;
    if (domainname.startsWith('www')) {
      domainname = window.location.hostname.slice(4);
    }
    let url = domainname + ':' + window.location.port;
    if (this.DEFAULT_API_PREFIXES.has(key)) {
      url = this.DEFAULT_API_PREFIXES.get(key) + '.' + url;
    }
    if (this.DEFAULT_API_PATHS.has(key)) {
      url = url + this.DEFAULT_API_PATHS.get(key);
    }
    url = window.location.protocol + '//' + url;
    return url;
  }


}
