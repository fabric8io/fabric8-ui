import { OpaqueToken } from '@angular/core'
import { ApiLocatorService } from './api-locator.service';

let forgeApiUrlLocatorToken = new OpaqueToken("fabric8.forge.api.url");

let forgeApiUrlFactory = (api: ApiLocatorService) => {
  return api.forgeApiUrl;
};

export let forgeApiUrlProvider = {
  provide: forgeApiUrlLocatorToken,
  useFactory: forgeApiUrlFactory,
  deps: [ApiLocatorService]
};
