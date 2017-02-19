import { RECOMMENDER_API_URL } from './../analyze/stack/recommender-api';
import { ApiLocatorService } from './api-locator.service';

let recommenderApiUrlFactory = (api: ApiLocatorService) => {
  return api.recommenderApiUrl;
};

export let recommenderApiUrlProvider = {
  provide: RECOMMENDER_API_URL,
  useFactory: recommenderApiUrlFactory,
  deps: [ApiLocatorService]
};
