import { Observable } from 'rxjs';

import { Fabric8UIConfig } from './fabric8-ui-config';
import { ConfigStore } from './../../base/config.store';
import { ValWrapper } from './../../base/val-wrapper';

let fabric8UIConfigName = 'fabric8-ui';

export class ObservableFabric8UIConfig extends Observable<Fabric8UIConfig> {}

let fabric8UIConfigFactory = (configStore: ConfigStore) => {
  return configStore.get<Fabric8UIConfig>(fabric8UIConfigName)
    .skipWhile(valWrapper => valWrapper.loading)
    .map(valWrapper => valWrapper.val);
};


export let fabric8UIConfigProvider = {
  provide: ObservableFabric8UIConfig,
  useFactory: fabric8UIConfigFactory,
  deps: [ConfigStore]
};

function syncFabric8UIConfigFactory(): Fabric8UIConfig {
  let answer = window['Fabric8UIEnv'] || {};
  // lets filter out any values of "undefined" in case an env var is missing in the template expression
  for (let key in answer) {
    let value = answer[key];
    if (value === "undefined") {
      answer[key] = "";
    }
  }
  return answer as Fabric8UIConfig;
}

export let syncFabric8UIConfigProvider = {
  provide: Fabric8UIConfig,
  useFactory: syncFabric8UIConfigFactory,
  deps: []
};
