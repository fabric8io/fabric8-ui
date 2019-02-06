import React, { Component, ReactNode, SyntheticEvent } from 'react';
import {
  Dropdown as PfDropdown,
  DropdownToggle,
  DropdownPosition,
  DropdownDirection,
} from '@patternfly/react-core';
import { OneOf } from '../../typeUtils';
import './Dropdown.scss';

export { DropdownDirection, DropdownPosition } from '@patternfly/react-core';

// Patternfly Dropdown doesn't allow for uncontrolled open / close.

// TODO bug in patternfly where we cannot set the iconComponent to null
const DropdownToggleAny = DropdownToggle as any;

// make onSelect optional
export interface DropdownProps {
  children: ReactNode;

  label: ReactNode;

  showArrow?: boolean;

  // TODO missing in typescirpt props in patternfly
  isPlain?: boolean;

  onSelect?: (e: SyntheticEvent<HTMLDivElement>) => void;

  position?: OneOf<typeof DropdownPosition, keyof typeof DropdownPosition>;
  direction?: OneOf<typeof DropdownDirection, keyof typeof DropdownDirection>;
}

type State = {
  isOpen: boolean;
};

export default class Dropdown extends Component<DropdownProps, State> {
  state = {
    isOpen: false,
  };

  render() {
    const { label, children, isPlain, showArrow, ...other } = this.props;
    const icon =
      (isPlain && showArrow !== true) || showArrow === false ? { iconComponent: null } : undefined;

    return (
      <PfDropdown
        isOpen={this.state.isOpen}
        {...other}
        onSelect={this.onSelect}
        toggle={
          <DropdownToggleAny
            onToggle={this.onToggle}
            {...icon}
            className={this.props.isPlain ? 'pf-m-plain' : undefined}
          >
            {label}
          </DropdownToggleAny>
        }
        dropdownItems={[<React.Fragment key="root">{children}</React.Fragment>]}
      />
    );
  }

  private onSelect = (event: React.SyntheticEvent<HTMLDivElement>) => {
    this.onToggle(false);
    this.props.onSelect && this.props.onSelect(event);
  };

  private onToggle = (isOpen: boolean) => {
    this.setState({ isOpen });
  };
}
