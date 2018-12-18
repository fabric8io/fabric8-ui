import { WIT_API_URL } from 'ngx-fabric8-wit';

let witApiUrlFactory = () => {
  console.log('Using as WIT url: ' + process.env.API_URL);
  return process.env.API_URL;
};

export let witApiUrlProvider = {
  provide: WIT_API_URL,
  useFactory: witApiUrlFactory,
};
