import { Injectable } from '@angular/core';

import { Fabric8UIConfig } from "./config/fabric8-ui-config";

const DEFAULT_API_ENV_VAR_NAMES = new Map<string, string>(
  [
    ['wit', 'FABRIC8_WIT_API_URL'],
    ['recommender', 'FABRIC8_RECOMMENDER_API_URL'],
    ['sso', 'FABRIC8_SSO_API_URL'],
    ['realm', 'FABRIC8_REALM'],
    ['branding', 'BRANDING'],
    ['forge', 'FABRIC8_FORGE_API_URL'],
    ['auth', 'FABRIC8_AUTH_API_URL']
  ]
);

const DEFAULT_API_PREFIXES = new Map<string, string>([
  ['wit', 'api'],
  ['recommender', 'recommender'],
  ['sso', 'sso'],
  ['forge', 'forge.api'],
  ['auth', 'auth']
]);

const DEFAULT_API_PATHS = new Map<string, string>([
  ['wit', 'api/'],
  ['auth', 'api/']

]);

export class BaseApiLocatorService {

  private envVars = new Map<string, string>();

  constructor(private config: Fabric8UIConfig, private apiPrefixes: Map<String, String>, private apiPaths: Map<String, String>) {
  }

  get realm(): string {
    return this.envVars.get('realm') || "fabric8";
  }

  get branding(): string {
    return this.envVars.get('branding') || "openshiftio";
  }

  get witApiUrl(): string {
    return this.config.witApiUrl || this.buildApiUrl('wit');
  }

  get forgeApiUrl(): string {
    return this.config.forgeApiUrl || this.buildApiUrl('forge')
  }

  get ssoApiUrl(): string {
    return this.config.ssoApiUrl || this.buildApiUrl('sso');
  }

  get authApiUrl(): string {
    return this.config.authApiUrl || this.buildApiUrl('auth')
  }

  get recommenderApiUrl(): string {
    return this.config.recommenderApiUrl || this.buildApiUrl('recommender');
  }

  protected loadEnvVar(key: string): void {
    this.envVars.set(key, process.env[DEFAULT_API_ENV_VAR_NAMES.get(key)]);
  }

  protected buildApiUrl(key: string): string {
    // Return any environment specified URLs for this API
    if (this.envVars.get(key)) {
      return this.envVars.get(key);
    }
    // Simple check to trim www
    let domainname = window.location.hostname;
    if (domainname.startsWith('www')) {
      domainname = window.location.hostname.slice(4);
    }
    let url = domainname;
    if (window.location.port) {
      url += ':' + window.location.port;
    }
    url += '/'
    if (this.apiPrefixes.has(key)) {
      url = this.apiPrefixes.get(key) + '.' + url;
    }
    if (this.apiPaths.has(key)) {
      url += this.apiPaths.get(key);
    }
    url = window.location.protocol + '//' + url;
    return url;
  }

}

@Injectable()
export class ApiLocatorService extends BaseApiLocatorService {

  constructor(config: Fabric8UIConfig) {
    super(config, DEFAULT_API_PREFIXES, DEFAULT_API_PATHS)
    DEFAULT_API_ENV_VAR_NAMES.forEach((value, key) => {
      this.loadEnvVar(key);
    });
  }
}
