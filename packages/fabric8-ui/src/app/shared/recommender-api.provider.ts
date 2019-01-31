import { RECOMMENDER_API_URL } from '../space/analyze/stack/recommender-api';
import { ApiLocatorService } from './api-locator.service';

const recommenderApiUrlFactory = (api: ApiLocatorService) => api.recommenderApiUrl;

export const recommenderApiUrlProvider = {
  provide: RECOMMENDER_API_URL,
  useFactory: recommenderApiUrlFactory,
  deps: [ApiLocatorService],
};
