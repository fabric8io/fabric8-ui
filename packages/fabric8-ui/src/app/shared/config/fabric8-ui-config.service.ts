import { Fabric8UIConfig } from './fabric8-ui-config';

function fabric8UIConfigFactory(): Fabric8UIConfig {
  const answer = window['Fabric8UIEnv'] || {};
  // lets filter out any values of "undefined" in case an env var is missing in the template expression
  for (const key in answer) {
    if (key && answer[key]) {
      const value = answer[key];
      if (value === 'undefined') {
        answer[key] = '';
      }
    }
  }
  return answer as Fabric8UIConfig;
}

export const fabric8UIConfigProvider = {
  provide: Fabric8UIConfig,
  useFactory: fabric8UIConfigFactory,
  deps: [],
};
