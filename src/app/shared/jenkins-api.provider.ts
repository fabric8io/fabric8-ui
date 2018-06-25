import { ApiLocatorService } from './api-locator.service';
import { FABRIC8_JENKINS_API_URL } from './runtime-console/fabric8-ui-jenkins-api';


let jenkinsApiUrlFactory = (api: ApiLocatorService) => {
  return api.jenkinsApiUrl;
};

export let jenkinsApiUrlProvider = {
  provide: FABRIC8_JENKINS_API_URL,
  useFactory: jenkinsApiUrlFactory,
  deps: [ApiLocatorService]
};
