import { SFC } from 'react';
import {
  BackgroundImage as PBackgroundImage,
  BackgroundImageSrc,
  BackgroundImageSrcMap,
} from '@patternfly/react-core';

import backgroundFilterImage from '@patternfly/patternfly-next/assets/images/background-filter.svg';

export { BackgroundImageSrc, BackgroundImageSrcMap, backgroundFilterImage };

export interface BackgroundImageProps {
  /** Override image styles using a string or BackgroundImageSrc */
  src: string | BackgroundImageSrcMap;
}

export default PBackgroundImage as SFC<BackgroundImageProps>;
