import React, { SFC, ReactNode } from 'react';
import { PageSection as PPageSection, PageSectionVariants } from '@patternfly/react-core';
import cx from '../../utils/classname-modifiers';

import './PageSection.scss';

export { PageSectionVariants };

export const PageSectionPadding = {
  default: '',
  sm: 'sm',
  none: 'none',
};

export interface PageSectionProps {
  /** Content rendered inside the section */
  children?: ReactNode;
  /** Section background color variant */
  variant?: keyof typeof PageSectionVariants;
  /** Whether the section is sticky to the top of the page */
  sticky?: boolean;
  /** Adjust the padding of the section */
  padding?: keyof typeof PageSectionPadding;
}

const PageSection: SFC<PageSectionProps> = ({ sticky, padding, ...props }) => (
  <PPageSection
    {...props}
    className={cx('osio-ui-PageSection', { sticky, [`padding-${padding}`]: padding })}
  />
);

export default PageSection;
