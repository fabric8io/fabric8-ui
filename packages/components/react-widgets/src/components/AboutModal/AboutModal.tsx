import { ReactNode, SFC } from 'react';
import { AboutModal as PAboutModal } from '@patternfly/react-core';

export interface AboutModalProps {
  /** Content rendered inside the About Modal. */
  children: ReactNode;
  /** Flag to show the About modal */
  isOpen?: boolean;
  /** A callback for when the close button is clicked */
  onClose?: Function;
  /** Product name */
  productName: string;
  /** Trademark information */
  trademark?: string;
  /** The URL of the image for the Brand */
  brandImageSrc: string;
  /** The alternate text of the Brand image */
  brandImageAlt: string;
  /** The URL of the image for the Logo */
  logoImageSrc?: string;
  /** The alternate text of the Logo image */
  logoImageAlt?: string;
  /** The URL of the image for the Hero */
  heroImageSrc: string;
  /** The alternate text of the Hero image */
  heroImageAlt?: string;
}

export default PAboutModal as SFC<AboutModalProps>;
