import { FABRIC8_FORGE_API_URL } from './fabric8-forge-api';

let forgeApiUrlFactory = () => {
  return process.env.FABRIC8_FORGE_API_URL;
};

export let forgeApiUrlProvider = {
  provide: FABRIC8_FORGE_API_URL,
  useFactory: forgeApiUrlFactory
};
