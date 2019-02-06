import React, { SFC, ReactNode } from 'react';
import cx from 'classnames';
import '@patternfly/patternfly-next/components/Content/content.css';

export interface ContentProps {
  /** Text content to style */
  children: ReactNode;

  /**
   * The component type to render
   *
   * @default div
   */
  component?: 'div' | 'section' | 'article';

  /** @ignore */
  className?: string;
}

/**
 * Generates vertical rythm and typographic treatment to html elements
 */
const Content: SFC<ContentProps> = ({ children, className, component, ...props }) => {
  const Element = component || 'div';
  return (
    <Element {...props} className={cx('pf-c-content', className)}>
      {children}
    </Element>
  );
};

export default Content;
