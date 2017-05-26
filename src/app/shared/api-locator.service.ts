import {Injectable} from "@angular/core";
import {currentOAuthConfig} from "fabric8-runtime-console/src/app/kubernetes/store/oauth-config-store";

@Injectable()
export class ApiLocatorService {

  readonly DEFAULT_API_ENV_VAR_NAMES = new Map<string, string>(
    [
      ['wit', 'FABRIC8_WIT_API_URL'],
      ['recommender', 'FABRIC8_RECOMMENDER_API_URL'],
      ['sso', 'FABRIC8_SSO_API_URL'],
      ['realm', 'FABRIC8_REALM'],
      ['forge', 'FABRIC8_FORGE_API_URL']

    ]
  );

  readonly DEFAULT_API_PREFIXES = new Map<string, string>([
    ['wit', 'api'],
    ['recommender', 'recommender'],
    ['sso', 'sso'],
    ['forge', 'forge.api']
  ]);

  readonly DEFAULT_API_PATHS = new Map<string, string>([
    ['wit', 'api/']
  ]);

  private envVars = new Map<string, string>();

  constructor() {
    this.DEFAULT_API_ENV_VAR_NAMES.forEach((value, key) => {
      this.loadEnvVar(key);
    });
  }

  get witApiUrl(): string {
    return this.buildApiUrl('wit', (config) => config.witApiUrl);
  }

  get realm(): string {
    return this.envVars.get('realm');
  }

  get forgeApiUrl(): string {
    let tmp=this.buildApiUrl('forge', (config) => config.forgeApiUrl);
    return tmp
  }

  get ssoApiUrl(): string {
    return this.buildApiUrl('sso', (config) => config.ssoApiUrl);
  }

  get recommenderApiUrl(): string {
    return this.buildApiUrl('recommender', (config) => config.recommenderApiUrl);
  }

  private loadEnvVar(key: string): void {
    this.envVars.set(key, process.env[this.DEFAULT_API_ENV_VAR_NAMES.get(key)]);
  }

  private buildApiUrl(key: string, fn: (OAuthConfig) => string): string {
    // for on premise and upstream we need to be able to dynamically discover endpoints
    // via environment variables on the server side
    let oauth = currentOAuthConfig();
    if (oauth != null && fn) {
      let value = fn(oauth);
      if (value) {
        return value;
      }
    }
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
    if (this.DEFAULT_API_PREFIXES.has(key)) {
      url = this.DEFAULT_API_PREFIXES.get(key) + '.' + url + '/';
    }
    if (this.DEFAULT_API_PATHS.has(key)) {
      url += this.DEFAULT_API_PATHS.get(key);
    }
    url = window.location.protocol + '//' + url;
    return url;
  }


}
