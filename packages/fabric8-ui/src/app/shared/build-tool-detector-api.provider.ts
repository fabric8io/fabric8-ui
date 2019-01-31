import { ApiLocatorService } from './api-locator.service';
import { FABRIC8_BUILD_TOOL_DETECTOR_API_URL } from './runtime-console/fabric8-ui-build-tool-detector-api';

const buildToolDetectorApiUrlFactory = (api: ApiLocatorService) => api.buildToolDetectorApiUrl;

export const buildToolDetectorApiUrlProvider = {
  provide: FABRIC8_BUILD_TOOL_DETECTOR_API_URL,
  useFactory: buildToolDetectorApiUrlFactory,
  deps: [ApiLocatorService],
};
