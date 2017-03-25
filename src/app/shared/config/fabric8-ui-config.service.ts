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
