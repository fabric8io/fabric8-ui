import { OpaqueToken } from '@angular/core';
import { WIT_API_URL } from 'ngx-fabric8-wit';

let witApiUrlFactory = () => {
  return process.env.FABRIC8_WIT_API_URL;
};

export let witApiUrlProvider = {
  provide: WIT_API_URL,
  useFactory: witApiUrlFactory
};
