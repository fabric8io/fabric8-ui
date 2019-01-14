import React, { SFC, ReactNode, SyntheticEvent } from 'react';
import { DropdownItem as PDropdownItem } from '@patternfly/react-core';

export interface DropdownItemProps {
  children: ReactNode;

  /**
   * @default false
   */
  isDisabled?: boolean;

  href?: string;

  onClick?: (e: SyntheticEvent) => void;

  target?: string;
}

const DropdownItem: SFC<DropdownItemProps> = (props) => (
  <PDropdownItem {...props} component={props.isDisabled || props.href == null ? 'button' : 'a'} />
);

export default DropdownItem;
