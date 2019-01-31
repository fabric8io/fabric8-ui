import { ApiLocatorService } from './api-locator.service';
import { FABRIC8_JENKINS_API_URL } from './runtime-console/fabric8-ui-jenkins-api';

const jenkinsApiUrlFactory = (api: ApiLocatorService) => api.jenkinsApiUrl;

export const jenkinsApiUrlProvider = {
  provide: FABRIC8_JENKINS_API_URL,
  useFactory: jenkinsApiUrlFactory,
  deps: [ApiLocatorService],
};
